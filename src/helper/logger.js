const { createLogger } = require("winston");
const { loggerFormat, loggerTransports, level } = require("../config/logger");

const logger = createLogger({
  level,
  format: loggerFormat,
  transports: loggerTransports,
});

module.exports = logger;
