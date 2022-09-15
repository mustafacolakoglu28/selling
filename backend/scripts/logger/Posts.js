const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "post-service" },
  transports: [
    new winston.transports.File({
      filename: "backend/logs/posts/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "backend/logs/posts/info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "backend/logs/posts/combined.log",
    }),
  ],
});

module.exports = logger;
