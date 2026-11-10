import { randomUUID } from "node:crypto";
import { db } from "@/db";
import {
  keywordGroups,
  keywordLabels,
  querySearchAnalytics,
  SearchConsoleError,
  searchReports,
  shiftSearchDate,
  summarizeMetrics,
  syncWindow,
  type SearchRow,
} from "./search-console-google";
import { accessToken, getGoogleConfig } from "./search-console-oauth";

const client = db.$client;
const leaseMs = 120_000;
const datesPerRun = 3;

export async function saveSearchConsoleConnection(property: string, refreshToken: string) {
  await client.batch([
    {
      sql: `INSERT INTO gsc_connection (id, property, refresh_token) VALUES (1, ?, ?)
            ON CONFLICT (id) DO UPDATE SET property = excluded.property, refresh_token = excluded.refresh_token`,
      args: [property, refreshToken],
    },
    "UPDATE gsc_sync SET lease = NULL, lease_until = NULL, last_finished = NULL, last_error = NULL WHERE id = 1",
  ], "write");
}

async function getSearchConsoleConnection() {
  const { rows: [row] } = await client.execute("SELECT property, refresh_token FROM gsc_connection WHERE id = 1");
  return row ? { property: String(row.property), refreshToken: String(row.refresh_token) } : null;
}

function toMetrics(row: { clicks: unknown; impressions: unknown; position: unknown }) {
  return {
    clicks: Number(row.clicks),
    impressions: Number(row.impressions),
    position: Number(row.position),
  };
}

async function saveSearchDate(
  owner: string,
  property: string,
  total: SearchRow,
  cycle: string,
  reports: Array<{ report: string; rows: SearchRow[] }>,
) {
  const [date] = total.keys;
  const tx = await client.transaction("write");
  try {
    const lock = await tx.execute({
      sql: "UPDATE gsc_sync SET lease_until = ? WHERE id = 1 AND lease = ?",
      args: [Date.now() + leaseMs, owner],
    });
    if (lock.rowsAffected !== 1) throw new SearchConsoleError("Search sync lease changed. Retry the sync.", 409);

    await tx.execute({ sql: "DELETE FROM gsc_metrics WHERE property = ? AND date = ?", args: [property, date] });
    for (const { report, rows } of reports) {
      for (let index = 0; index < rows.length; index += 200) {
        await tx.batch(rows.slice(index, index + 200).map(row => ({
          sql: `INSERT INTO gsc_metrics (property, date, report, dimension, second_dimension, clicks, impressions, position)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [property, date, report, row.keys[0], row.keys[1] ?? "", row.clicks, row.impressions, row.position],
        })));
      }
    }

    await tx.execute({
      sql: `INSERT INTO gsc_days (property, date, cycle, clicks, impressions, position) VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT (property, date) DO UPDATE SET cycle = excluded.cycle, clicks = excluded.clicks,
              impressions = excluded.impressions, position = excluded.position`,
      args: [property, date, cycle, total.clicks, total.impressions, total.position],
    });
    await tx.commit();
  } finally {
    tx.close();
  }
}

export async function syncSearchConsole() {
  const config = getGoogleConfig();
  if (!config) throw new SearchConsoleError("Configure Google Search Console credentials first.", 428);

  const owner = randomUUID();
  const now = Date.now();
  const lock = await client.execute({
    sql: `UPDATE gsc_sync SET lease = ?, lease_until = ? WHERE id = 1
          AND (lease IS NULL OR lease_until <= ?)`,
    args: [owner, now + leaseMs, now],
  });
  if (lock.rowsAffected !== 1) throw new SearchConsoleError("A search sync is already running.", 409);

  try {
    const connection = await getSearchConsoleConnection();
    if (!connection) throw new SearchConsoleError("Connect a Google account with access to the site first.", 428);
    const { property, refreshToken } = connection;
    const token = await accessToken(config, refreshToken);
    const { start, end, cycle } = syncWindow(new Date(now));
    const totals = await querySearchAnalytics(token, property, {
      startDate: start,
      endDate: end,
      dimensions: ["date"],
    });
    const { rows } = await client.execute({
      sql: "SELECT date, cycle FROM gsc_days WHERE property = ? AND date >= ?",
      args: [property, start],
    });

    totals.sort((a, b) => a.keys[0].localeCompare(b.keys[0]));
    const latestDate = totals.at(-1)?.keys[0];
    const recentStart = latestDate ? shiftSearchDate(latestDate, -6) : end;
    const synced = new Map(rows.map(row => [String(row.date), String(row.cycle)]));
    const pending = totals.filter(({ keys: [date] }) =>
      !synced.has(date) || (date >= recentStart && synced.get(date) !== cycle),
    ).reverse();
    const batch = pending.slice(0, datesPerRun);
    for (const total of batch) {
      const [date] = total.keys;
      const reports = await Promise.all(Object.entries(searchReports).map(async ([report, dimensions]) => ({
        report,
        rows: await querySearchAnalytics(token, property, {
          startDate: date, endDate: date, dimensions,
        }),
      })));
      await saveSearchDate(owner, property, total, cycle, reports);
    }

    const remaining = pending.length - batch.length;
    await client.execute({
      sql: `UPDATE gsc_sync SET last_error = NULL, last_finished = CASE WHEN ? = 0 THEN ? ELSE last_finished END
            WHERE id = 1 AND lease = ?`,
      args: [remaining, Date.now(), owner],
    });
    return { processed: batch.length, remaining, latestDate };
  } catch (error) {
    await client.execute({
      sql: "UPDATE gsc_sync SET last_error = ? WHERE id = 1 AND lease = ?",
      args: [searchConsoleErrorMessage(error), owner],
    });
    throw error;
  } finally {
    await client.execute({
      sql: "UPDATE gsc_sync SET lease = NULL, lease_until = NULL WHERE id = 1 AND lease = ?",
      args: [owner],
    });
  }
}

export function searchConsoleErrorMessage(error: unknown) {
  return error instanceof SearchConsoleError ? error.message : "Search Console sync failed. Check the connection and retry.";
}

type NamedMetrics = ReturnType<typeof toMetrics> & { dimension: string; secondDimension: string };

export async function readSearchConsoleOverview() {
  const connection = await getSearchConsoleConnection();
  const { rows: [status] } = await client.execute("SELECT last_finished, last_error, lease_until FROM gsc_sync WHERE id = 1");
  const base = {
    property: connection?.property ?? null,
    lastFinished: status?.last_finished == null ? null : Number(status.last_finished),
    lastError: status?.last_error == null ? null : String(status.last_error),
    running: Number(status?.lease_until) > Date.now(),
  };
  if (!connection) return { ...base, report: null };

  const { property } = connection;
  const { rows: [latest] } = await client.execute({
    sql: "SELECT MAX(date) AS date FROM gsc_days WHERE property = ?",
    args: [property],
  });
  if (!latest?.date) return { ...base, report: null };

  const end = String(latest.date);
  const start = shiftSearchDate(end, -27);
  const previousStart = shiftSearchDate(start, -28);
  const [totals, breakdown] = await Promise.all([
    client.execute({
      sql: "SELECT date, clicks, impressions, position FROM gsc_days WHERE property = ? AND date BETWEEN ? AND ?",
      args: [property, previousStart, end],
    }),
    client.execute({
      sql: `SELECT report, dimension, second_dimension, SUM(clicks) AS clicks, SUM(impressions) AS impressions,
                   SUM(impressions * position) / NULLIF(SUM(impressions), 0) AS position
            FROM gsc_metrics WHERE property = ? AND date BETWEEN ? AND ?
            GROUP BY report, dimension, second_dimension ORDER BY clicks DESC, impressions DESC, dimension`,
      args: [property, start, end],
    }),
  ]);
  const recent = totals.rows.filter(row => String(row.date) >= start);
  const previous = totals.rows.filter(row => String(row.date) < start);
  const reports: Record<string, NamedMetrics[]> = {};
  for (const row of breakdown.rows) {
    const key = String(row.report);
    (reports[key] ??= []).push({
      ...toMetrics({ clicks: row.clicks, impressions: row.impressions, position: row.position }),
      dimension: String(row.dimension),
      secondDimension: String(row.second_dimension),
    });
  }
  const queries = reports.query ?? [];
  const keywordRows = Object.entries(keywordLabels).map(([key, label]) => ({
    label,
    ...summarizeMetrics(queries.filter(row => keywordGroups(row.dimension).some(group => group === key))),
  }));
  return {
    ...base,
    report: {
      start, end, previousStart, previousEnd: shiftSearchDate(start, -1),
      recent: summarizeMetrics(recent.map(row => toMetrics({
        clicks: row.clicks, impressions: row.impressions, position: row.position,
      }))),
      previous: summarizeMetrics(previous.map(row => toMetrics({
        clicks: row.clicks, impressions: row.impressions, position: row.position,
      }))),
      recentDates: recent.length,
      previousDates: previous.length,
      reports,
      keywordRows,
    },
  };
}
