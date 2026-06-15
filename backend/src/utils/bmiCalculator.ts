export function calculateBmi(heightCm: number, weightKg: number) {
  if (!heightCm || !weightKg) return 0
  const heightM = heightCm / 100
  return Number((weightKg / (heightM * heightM)).toFixed(2))
}

export function bmiAdvice(bmi: number) {
  if (bmi < 18.5) return '增肌与基础力量优先'
  if (bmi < 24) return '保持训练节奏'
  if (bmi < 28) return '增加有氧与饮食记录'
  return '建议教练介入做阶段计划'
}

