const { spawn } = require("node:child_process");
const { createServer } = require("node:http");
const { parseArgs } = require("node:util");

const args = process.argv.slice(2);
const { values } = parseArgs({
  args,
  options: { port: { type: "string", short: "p" } },
  strict: false,
  allowPositionals: true,
});
const port = Number(values.port ?? (process.env.PORT || 3091));
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Choose a local preview port between 1 and 65535.");
}

const hostname = "127.0.0.1";
const origin = `http://${hostname}:${port}`;
const app = spawn(process.execPath, [
  require.resolve("next/dist/bin/next"), "dev", "--turbo", ...args, "--hostname", hostname,
], {
  env: { ...process.env, PORT: String(port) },
  stdio: "inherit",
});

const aliases = [3091, 3100].filter(alias => alias !== port).map(alias => {
  const server = createServer((request, response) => {
    const path = request.url?.startsWith("/") ? request.url : "/";
    response.writeHead(307, { Location: origin + path, "Cache-Control": "no-store" }).end();
  });
  server.on("error", error => {
    console.warn(`TEAO preview alias ${alias} is unavailable: ${error.message}`);
  });
  server.listen(alias, hostname, () => {
    console.log(`TEAO preview alias http://${hostname}:${alias} → ${origin}`);
  });
  return server;
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => app.kill(signal));
}
app.on("error", error => {
  console.error(error.message);
});
app.on("close", (code, signal) => {
  for (const server of aliases) {
    server.close();
    server.closeAllConnections();
  }
  process.exitCode = code ?? (signal === "SIGINT" || signal === "SIGTERM" ? 0 : 1);
});
