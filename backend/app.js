const express = require("express");
const config = require("./config");
const loaders = require("./loaders");
const { PostRoutes } = require("./routes");

config();
loaders();

const app = express();
app.use(express.json());

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
  app.use("/posts", PostRoutes);
});
