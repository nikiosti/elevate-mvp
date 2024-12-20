import api from '@/api/axios'
import { TreeNodeData } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'

export const useCategories = () => {
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    initialData: [],
    queryFn: async () => {
      const { data } = await api.get('/api/categories')
      return data
    },
  })

  const { data: categoriesPublic } = useQuery<TreeNodeData[]>({
    queryKey: ['categoriesPublic'],
    queryFn: async () => {
      const { data } = await api.get('/api/public/categories')
      return data
    },
  })

  const createCategory = useMutation({
    mutationFn: async (body: { name: string; id: string; level: number; parentId?: string | null }) => {
      const { data } = await api.post('/api/categories', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryItems'] })
    },
  })

  const patchCategory = useMutation({
    mutationFn: async (body: { name: string; id: string; level?: number; parentId?: string }) => {
      const { data } = await api.patch('/api/categories', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryItems'] })
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
    createCategory,
    categories,
    categoriesPublic,
    patchCategory: patchCategory,
    deleteCategory: deleteCategory,
  }
}
