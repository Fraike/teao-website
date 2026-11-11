const { setTimeout: delay } = require("node:timers/promises");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
const secret = process.env.TEAO_JOBS_SECRET;
const port = process.env.PORT || "3091";
const origin = new URL(process.env.TEAO_JOBS_URL || `http://127.0.0.1:${port}`);
if (!["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname)) {
  throw new Error("TEAO_JOBS_URL must use a loopback host.");
}
if (!secret || secret.length < 32) throw new Error("Configure TEAO_JOBS_SECRET with at least 32 characters.");

const shanghai = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23",
});

async function post(path, payload, timeout = 30000) {
  return fetch(new URL(path, origin), {
    method: "POST",
    redirect: "error",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeout),
  });
}

async function report(job, error = null) {
  try {
    const response = await post("/api/internal/operations", { job, error });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (failure) {
    console.error(`Could not report ${job} status: ${failure.message}`);
  }
}

async function mail() {
  try {
    const response = await post("/api/internal/inquiry-mail/run", {}, 90000);
    if (!response.ok) throw new Error(`Mail worker returned HTTP ${response.status}`);
    await report("inquiry-mail");
  } catch (error) {
    await report("inquiry-mail", error.message);
  }
}

async function search() {
  try {
    for (let batch = 0; batch < 40; batch++) {
      const response = await post("/api/admin/search-console/sync", {}, 240000);
      if (response.status === 428) {
        await report("search-console", "Google authorization required");
        return false;
      }
      if (!response.ok) throw new Error(`Search sync returned HTTP ${response.status}`);
      const result = await response.json();
      if (result.remaining === 0) {
        await report("search-console");
        return true;
      }
    }
    throw new Error("Search sync has pending batches");
  } catch (error) {
    await report("search-console", error.message);
    return false;
  }
}

async function alerts() {
  try {
    const response = await post("/api/internal/operations", { job: "alerts" });
    if (!response.ok) console.error(`Website alert check returned HTTP ${response.status}`);
  } catch (error) {
    console.error(`Website alert check failed: ${error.message}`);
  }
}

async function run() {
  let completedSearchDay = "";
  let searchAfter = 0;
  let alertAfter = 0;
  let searchRunning = false;
  while (true) {
    const now = Date.now();
    const parts = shanghai.formatToParts(now);
    const day = parts.filter(part => ["year", "month", "day"].includes(part.type)).map(part => part.value).join("-");
    const hour = Number(parts.find(part => part.type === "hour").value);
    if (!searchRunning && hour >= 10 && completedSearchDay !== day && now >= searchAfter) {
      searchRunning = true;
      void search().then(success => {
        if (success) completedSearchDay = day;
      }).finally(() => {
        searchAfter = Date.now() + 15 * 60000;
        searchRunning = false;
      });
    }
    await mail();
    if (now >= alertAfter) {
      await alerts();
      alertAfter = Date.now() + 15 * 60000;
    }
    await delay(60000);
  }
}

run().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
