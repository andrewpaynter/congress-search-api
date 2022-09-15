import winston from 'winston'

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: 'logfile.log',
      level: 'error',
      handleExceptions: true,
    }),
  ],
})

export default logger