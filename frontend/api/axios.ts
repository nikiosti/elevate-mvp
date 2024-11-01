import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

// Define the API client
const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
})

// Extend AxiosRequestConfig to add custom properties
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

// Track the refresh status and queued requests
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// Subscribe function for queuing requests during token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

// Function to execute queued requests after refresh
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken))
  refreshSubscribers = []
}

// Request interceptor to add the Authorization header
api.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      request.headers = request.headers ?? {}
      request.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return request
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle 401 errors and refresh tokens
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    // Check if the error is a 401 and prevent infinite loops with the _retry flag
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        try {
          // Request a new token
          const response = await api.post<{ accessToken: string }>('/auth/google/refresh')
          const newAccessToken = response.data.accessToken
          localStorage.setItem('accessToken', newAccessToken)

          // Retry the original request with the new token
          onTokenRefreshed(newAccessToken)
          isRefreshing = false
          return api(originalRequest)
        } catch (refreshError) {
          console.error('Ошибка обновления токена:', refreshError)
          isRefreshing = false
          // Redirect to login if token refresh fails
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        // Queue requests while token refresh is in progress
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`
            }
            resolve(api(originalRequest))
          })
        })
      }
    }

    return Promise.reject(error)
  }
)

export default api
