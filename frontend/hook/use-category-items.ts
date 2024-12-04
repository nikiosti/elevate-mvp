import api from '@/api/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Category, Item } from '@prisma/client'

export const useCategoryItems = (id: string) => {
  const queryClient = useQueryClient()

  const categoryItems = useQuery<Category & { items: Item[]; children: Category[] }>({
    queryKey: ['categoryItems'],

    queryFn: async () => {
      const { data } = await api.get('/api/category-items/' + id)
      return data
    },
  })

  const mutation = useMutation({
    mutationFn: async (body: { name: string }) => {
      const { data } = await api.post('/api/root/categories', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const patchCategory = useMutation({
    mutationFn: async (body: { name: string; id: string; level?: number; parentId?: string }) => {
      const { data } = await api.patch('/api/categories', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const deleteCategory = useMutation({
    mutationFn: async (body: { id: string }) => {
      const { data } = await api.delete('/api/categories/' + body.id)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  return {
    categoryItems,

    addRootCategory: mutation.mutate,
    patchCategory: patchCategory,
    deleteCategory: deleteCategory,
  }
}
