const port = process.env.PORT || "3000";

module.exports = {
  apps: [
    {
      name: "teao-website",
      script: "node_modules/.bin/next",
      args: "start -H 127.0.0.1",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: port,
      },
    },
    {
      name: "teao-website-jobs",
      script: "scripts/run-website-jobs.cjs",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      restart_delay: 10000,
      env: {
        NODE_ENV: "production",
        PORT: port,
      },
    },
  ],
};
