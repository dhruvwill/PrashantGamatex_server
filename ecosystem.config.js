module.exports = {
  apps: [
    {
      name: "Prasad Group",
      script: "./dist/index.js",
      watch: ".",
      env: {
        PORT: 3000,
        JWT_SECRET: "PRA$H@NTG@M@T3X",
      },
    },
  ],
};
