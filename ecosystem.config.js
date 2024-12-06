module.exports = {
  apps: [
    {
      name: "Prashant Group",
      script: "./dist/index.js",
      watch: ["dist"],
      ignore_watch: ["node_modules", "logs"],
      env: {
        PORT: 3000,
        JWT_SECRET: "PRA$H@NTG@M@T3X",
      },
    },
  ],
};
