const express = require("express");
const fileUpload = require("express-fileupload");
const config = require("./config");
const loaders = require("./loaders");
const helmet = require("helmet");
const events = require("./scripts/events");
const path = require("path");
const { PostRoutes, UserRoutes, OrderRoutes } = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
config();
loaders();
events();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "./", "uploads")));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
  app.use("/posts", PostRoutes);
  app.use("/users", UserRoutes);
  app.use("/orders", OrderRoutes);
  app.use(errorHandler);
});
