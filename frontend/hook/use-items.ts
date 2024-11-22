import api from '@/api/axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Item } from '@prisma/client'
export const useItems = () => {
  const queryClient = useQueryClient()

  const { data: itemsPublic } = useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: async () => {
      const { data } = await api.get('/api/public/items/3d0d986b-8700-4c97-93fb-16cdb1204c06')

      return data
    },
  })

  return { itemsPublic }
}
