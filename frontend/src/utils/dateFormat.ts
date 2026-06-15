import dayjs from 'dayjs'

export function formatDateTime(value: string | Date) {
  return dayjs(value).format('MM月DD日 HH:mm')
}

export function formatDate(value: string | Date) {
  return dayjs(value).format('YYYY-MM-DD')
}

