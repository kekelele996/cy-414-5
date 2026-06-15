import { defineStore } from 'pinia'
import { bodyMetricApi } from '@/api/bodyMetric'
import type { BodyMetric } from '@/types/domain'
import { calculateBmi, getBmiLevel } from '@/utils/bmiCalculator'

const demoMetrics: BodyMetric[] = [
  { id: 1, userId: 1, weight: 60.2, bodyFat: 24, muscle: 39, bmi: 21.3, advice: getBmiLevel(21.3), recordDate: '2026-05-15' },
  { id: 2, userId: 1, weight: 59.4, bodyFat: 23.1, muscle: 39.8, bmi: 21.0, advice: getBmiLevel(21.0), recordDate: '2026-05-30' },
  { id: 3, userId: 1, weight: 58.7, bodyFat: 22.4, muscle: 40.2, bmi: 20.8, advice: getBmiLevel(20.8), recordDate: '2026-06-12' }
]

export const useBodyMetricStore = defineStore('bodyMetrics', {
  state: () => ({
    list: demoMetrics
  }),
  actions: {
    async loadMetrics() {
      try {
        this.list = await bodyMetricApi.list()
      } catch {
        this.list = demoMetrics
      }
    },
    async create(payload: { weight: number; bodyFat?: number; muscle?: number; height?: number; recordDate: string }) {
      try {
        const metric = await bodyMetricApi.create(payload)
        this.list.push(metric)
      } catch {
        const bmi = calculateBmi(payload.height || 168, payload.weight)
        this.list.push({
          id: Date.now(),
          userId: 1,
          weight: payload.weight,
          bodyFat: payload.bodyFat,
          muscle: payload.muscle,
          bmi,
          advice: getBmiLevel(bmi),
          recordDate: payload.recordDate
        })
      }
    }
  }
})

