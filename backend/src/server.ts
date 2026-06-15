import { app } from './app'
import { appConfig } from './config/app'
import { logger } from './utils/logger'

const server = app.listen(appConfig.port, () => {
  logger.info('BACKEND_START', { port: appConfig.port })
  console.log(`FitPro backend listening on ${appConfig.port}`)
})

process.on('SIGTERM', () => {
  server.close(() => process.exit(0))
})

