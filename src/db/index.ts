import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

const client = tursoUrl && tursoToken
  ? createClient({ url: tursoUrl, authToken: tursoToken })
  : createClient({ url: "file:data/teao.db" });

export const db = drizzle(client, { schema });
