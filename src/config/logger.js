const { format, transports } = require("winston");
const path = require("path");

let appRoot = path.dirname(
  require.main.filename || process.mainModule.filename
);

if (process.env.NODE_ENV === "production") {
  appRoot = path.join(appRoot, "..");
}

// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const level = process.env.LOG_LEVEL || "debug";

// Create formatter
function formatParams(info) {
  const { timestamp, level, message, ...args } = info;
  const ts = timestamp.slice(0, 19).replace("T", " ");

  return `${ts} ${level}: ${message} ${
    Object.keys(args).length ? JSON.stringify(args, "", "") : ""
  }`;
}

const developmentFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

const productionFormat = format.combine(
  format.timestamp(),
  format.align(),
  format.printf(formatParams)
);

const loggerFormat =
  process.env.NODE_ENV !== "production" ? developmentFormat : productionFormat;

// Create transports for loging by env. can be also cloud
const loggerTransports =
  process.env.NODE_ENV == "production"
    ? [
        new transports.File({
          filename: `${appRoot}/logs/error.log`,
          level: "error",
        }),
        new transports.File({ filename: `${appRoot}/logs/combined.log` }),
      ]
    : [new transports.Console()];

module.exports = { loggerFormat, loggerTransports, level };
