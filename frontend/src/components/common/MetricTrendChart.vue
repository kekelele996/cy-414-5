<template>
  <div ref="chartRef" class="metric-chart" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { BodyMetric } from '@/types/domain'

const props = defineProps<{
  metrics: BodyMetric[]
}>()

const chartRef = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null

function render() {
  if (!chartRef.value) return
  chart ||= echarts.init(chartRef.value)
  chart.setOption({
    color: ['#1b6b4a', '#d96f32', '#385f8f'],
    grid: { left: 36, right: 12, top: 24, bottom: 28 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: props.metrics.map(item => item.recordDate.slice(5)),
      axisLine: { lineStyle: { color: '#cbd6d0' } }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#e6ece8' } }
    },
    series: [
      { name: '体重', type: 'line', smooth: true, data: props.metrics.map(item => item.weight) },
      { name: '体脂', type: 'line', smooth: true, data: props.metrics.map(item => item.bodyFat) },
      { name: 'BMI', type: 'line', smooth: true, data: props.metrics.map(item => item.bmi) }
    ]
  })
}

function resize() {
  chart?.resize()
}

onMounted(() => {
  render()
  window.addEventListener('resize', resize)
})

watch(() => props.metrics, render, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart?.dispose()
})
</script>

<style scoped>
.metric-chart {
  width: 100%;
  min-height: 320px;
}
</style>

