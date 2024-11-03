import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
})

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        try {
          const response = await api.post<{ accessToken: string }>('/auth/refresh')
          const newAccessToken = response.data.accessToken
          localStorage.setItem('accessToken', newAccessToken)

          onTokenRefreshed(newAccessToken)
          isRefreshing = false
          return api(originalRequest)
        } catch (refreshError) {
          console.error('Ошибка обновления токена:', refreshError)
          isRefreshing = false

          return Promise.reject(refreshError)
        }
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(api(originalRequest))
          })
        })
      }
    }

    return Promise.reject(error)
  }
)

export default api
