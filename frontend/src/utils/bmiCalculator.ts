export function calculateBmi(heightCm: number, weightKg: number) {
  if (!heightCm || !weightKg) return 0
  const heightM = heightCm / 100
  return Number((weightKg / (heightM * heightM)).toFixed(2))
}

export function getBmiLevel(bmi: number) {
  if (bmi < 18.5) return '偏瘦'
  if (bmi < 24) return '标准'
  if (bmi < 28) return '偏高'
  return '需要干预'
}

