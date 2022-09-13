const { connectDB } = require("./mongo-connection");
module.exports = () => {
  connectDB();
};
