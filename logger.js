const winston = require("winston");

class Logger {

    constructor(name, options) {
        this.logger = winston.createLogger({
            level: options.logLevel,
            defaultMeta: { service: name },
            transports: [
                new winston.transports.File({ 
                    filename: './logs/' + name + '.log',
                    timestamp: true,
                    colorize: true,
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.errors({ stack: true }),
                        winston.format.json()
                    )
                })
            ]
        });

/*             transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.metadata({ fillExcept: ['timestamp', 'service', 'level', 'message'] }),
                        winston.format.colorize(),
                        this.winstonConsoleFormat()
                    )
                }),
                new winston.transports.File({ 
                    filename: './logs/' + name + '.log',
                    format: winston.format.combine(
                        winston.format.errors({ stack: true }),
                        winston.format.metadata(),
                        winston.format.json()
                    )
                })
            ]
        }); */

        //
        // If we're not in production then log to the `console` with the format:
        // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
        //
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.metadata({ fillExcept: ['timestamp', 'service', 'level', 'message'] }),
                    winston.format.colorize(),
                    this.winstonConsoleFormat()
                )
            }));
        }
    }

    winstonConsoleFormat() {
        return winston.format.printf(({ timestamp, level, message, metadata }) => {
            const metadataString = metadata != null ? JSON.stringify(metadata) : '';
    
            if (process.env.LOG_TIMESTAMP) {
                return `[${timestamp}]  [${level}]  ${message}.  ${'metadata: ' + metadataString}`;
            } else {
                //console.log (`[${level}]  ${message}.  ${'-->  ' + metadataString}`);
                return `[${level}]  ${message}.  ${'-->  ' + metadataString}`;
            }

        })
    }

    // Expose different log levels
    debug(log, metadata) {
        this.logger.debug(log, metadata);
    }

    info(log, metadata) {
        this.logger.info(log, metadata);
    }

    warn(log, metadata) {
        this.logger.warn(log, metadata);
    }

    error(log, metadata) {
        this.logger.error(log, metadata);
    }

    log(level, log, metadata) {
        const metadataObject = {};
        if (metadata) metadataObject.metadata = metadata

        this.logger[level](log, metadataObject)
    }

}
 
// Exporting Logger with a name
module.exports = new Logger(process.env.APP_NAME, {
    logLevel: process.env.LOG_LEVEL
});
//module.exports = new Logger("WLogger")

// Expose a function to use logger with custom parameter
module.getLogger = (name) => {
    return new Logger(name);
}
