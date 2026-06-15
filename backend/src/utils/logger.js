const { LOG_TEMPLATES } = require('../constants/logTemplates')

function fill(template, payload) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(payload[key] ?? '-'))
}

const logger = {
  info(key, payload = {}) {
    const template = LOG_TEMPLATES[key] || key
    console.log(JSON.stringify({ level: 'info', message: fill(template, payload), payload }))
  },
  warn(key, payload = {}) {
    const template = LOG_TEMPLATES[key] || key
    console.warn(JSON.stringify({ level: 'warn', message: fill(template, payload), payload }))
  },
  error(key, payload = {}) {
    const template = LOG_TEMPLATES[key] || key
    console.error(JSON.stringify({ level: 'error', message: fill(template, payload), payload }))
  }
}

module.exports = { logger }

