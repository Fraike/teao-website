module.exports = {
  apps: [
    {
      name: "teao-website",
      script: "node_modules/.bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      cwd: "/home/ubuntu/teao-website",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
