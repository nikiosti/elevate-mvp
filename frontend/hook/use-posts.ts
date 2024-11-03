import { useQuery } from '@tanstack/react-query'
import api from '@/api/axios'

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await api.get('/posts')
      return data
    },
  })
}
