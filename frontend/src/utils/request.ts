import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ErrorCodes } from '@/constants/errorCodes'

export const request = axios.create({
  baseURL: '/api',
  timeout: 8000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('fitpro_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  response => response.data,
  error => {
    const code = error.response?.data?.code || ErrorCodes.AUTH_TOKEN_INVALID
    const message = error.response?.data?.message || '接口暂不可用，已切换到本地演示数据'
    if (code !== ErrorCodes.AUTH_TOKEN_MISSING) {
      ElMessage.warning(message)
    }
    return Promise.reject(error)
  }
)

