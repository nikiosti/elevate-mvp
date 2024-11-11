import { useQuery } from '@tanstack/react-query'
import api from '@/api/axios'

export const useUser = () => {
  return useQuery<{ id: string; email: string; name?: string; role: 'user' | 'admin' }>({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await api.get('/user')
      return data
    },
  })
}
