import { request } from '@/utils/request'
import type { BodyMetric } from '@/types/domain'

export const bodyMetricApi = {
  list() {
    return request.get<unknown, BodyMetric[]>('/body-metrics')
  },
  trend() {
    return request.get<unknown, BodyMetric[]>('/body-metrics/trend')
  },
  create(payload: Partial<BodyMetric> & { height?: number }) {
    return request.post<unknown, BodyMetric>('/body-metrics', payload)
  }
}

