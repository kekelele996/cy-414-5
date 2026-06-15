import type { LogTemplateKey } from '../constants/logTemplates'

export const logger: {
  info: (key: LogTemplateKey | string, payload?: Record<string, unknown>) => void
  warn: (key: LogTemplateKey | string, payload?: Record<string, unknown>) => void
  error: (key: LogTemplateKey | string, payload?: Record<string, unknown>) => void
}

