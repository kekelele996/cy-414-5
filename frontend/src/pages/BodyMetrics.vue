<template>
  <div class="section-band">
    <section class="grid-2">
      <div class="panel">
        <div class="section-title">
          <h2>新增体测</h2>
          <span>{{ previewBmi ? `BMI ${previewBmi} · ${getBmiLevel(previewBmi)}` : '填写后自动计算' }}</span>
        </div>
        <el-form class="metric-form" label-position="top">
          <el-form-item label="体重 kg">
            <el-input-number v-model="form.weight" :min="30" :max="200" :step="0.1" />
          </el-form-item>
          <el-form-item label="身高 cm">
            <el-input-number v-model="form.height" :min="120" :max="230" />
          </el-form-item>
          <el-form-item label="体脂 %">
            <el-input-number v-model="form.bodyFat" :min="0" :max="80" :step="0.1" />
          </el-form-item>
          <el-form-item label="肌肉量 kg">
            <el-input-number v-model="form.muscle" :min="0" :max="120" :step="0.1" />
          </el-form-item>
          <el-form-item label="记录日期">
            <el-date-picker v-model="form.recordDate" value-format="YYYY-MM-DD" type="date" />
          </el-form-item>
          <el-button type="primary" :icon="Plus" @click="submit">保存体测</el-button>
        </el-form>
      </div>

      <div class="panel">
        <div class="section-title">
          <h2>趋势图</h2>
          <span>体重、体脂、BMI</span>
        </div>
        <MetricTrendChart :metrics="metricStore.list" />
      </div>
    </section>

    <section class="list-stack">
      <article v-for="metric in metricStore.list.slice().reverse()" :key="metric.id" class="booking-row">
        <div>
          <h3>{{ metric.recordDate }} · {{ metric.advice || getBmiLevel(metric.bmi) }}</h3>
          <p>体重 {{ metric.weight }}kg · 体脂 {{ metric.bodyFat || '-' }}% · 肌肉 {{ metric.muscle || '-' }}kg</p>
        </div>
        <strong>BMI {{ metric.bmi }}</strong>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { Plus } from '@lucide/vue'
import MetricTrendChart from '@/components/common/MetricTrendChart.vue'
import { useBodyMetricStore } from '@/stores/bodyMetricStore'
import { calculateBmi, getBmiLevel } from '@/utils/bmiCalculator'

const metricStore = useBodyMetricStore()
const form = reactive({
  weight: 58.5,
  height: 168,
  bodyFat: 22.1,
  muscle: 40.4,
  recordDate: dayjs().format('YYYY-MM-DD')
})

const previewBmi = computed(() => calculateBmi(form.height, form.weight))

async function submit() {
  await metricStore.create(form)
  ElMessage.success('体测记录已保存')
}

onMounted(() => metricStore.loadMetrics())
</script>

<style scoped>
.metric-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 14px;
  margin-top: 18px;
}

.metric-form .el-button {
  grid-column: 1 / -1;
}

@media (max-width: 620px) {
  .metric-form {
    grid-template-columns: 1fr;
  }
}
</style>
