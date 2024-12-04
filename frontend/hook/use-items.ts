import api from '@/api/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Item } from '@prisma/client'

export const useItems = (id?: string) => {
  const queryClient = useQueryClient()

  const item = useQuery<Item>({
    queryKey: ['item', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/item/${id}`)
      return data
    },
    enabled: Boolean(id),
  })

  const postItem = useMutation({
    mutationFn: async (body: Item) => {
      const { data } = await api.post(`/api/item`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item'] })
      queryClient.invalidateQueries({ queryKey: ['categoryItems'] })
    },
  })

  const patchItem = useMutation({
    mutationFn: async (body: { name?: string; position?: string }) => {
      const { data } = await api.patch(`/api/item/${body.id}`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item'] })
      queryClient.invalidateQueries({ queryKey: ['categoryItems'] })
    },
  })

  const patchItemPosition = useMutation({
    mutationFn: async (body: { fromId: string; toId: string; fromPositon: number; toPositon: number }) => {
      const { data } = await api.patch(`/api/item-position`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item'] })
      queryClient.invalidateQueries({ queryKey: ['categoryItems'] })
    },
  })

  return { item, patchItem, patchItemPosition, postItem }
}
