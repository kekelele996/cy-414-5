import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { appConfig } from './config/app'
import { apiRoutes } from './routes'
import { errorHandler, notFound } from './middlewares/errorHandler'

export const app = express()

app.use(helmet())
app.use(cors({ origin: appConfig.corsOrigin, credentials: true }))
app.use(express.json())
app.use(morgan('tiny'))

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'fitpro-backend' })
})

app.use(apiRoutes)
app.use(notFound)
app.use(errorHandler)

