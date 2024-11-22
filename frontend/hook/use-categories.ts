import api from '@/api/axios'
import { TreeNodeData } from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { AxiosError } from 'axios'

interface Category {
  id: number
  name: string
  parentId: number | null
  children: Category[]
}

export const useCategories = () => {
  const queryClient = useQueryClient()

  const transformData = (data: any[]): TreeNodeData[] => {
    return data?.map((item) => ({
      value: item.id,
      label: item.name,
      children: transformData(item.children),
    }))
  }
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/api/categories')

      return transformData(data)
    },
  })

  const { data: categoriesPublic } = useQuery<TreeNodeData[]>({
    queryKey: ['categoriesPublic'],
    queryFn: async () => {
      const { data } = await api.get('/api/public/categories')
      return transformData(data)
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

  const createSubCategory = useMutation({
    mutationFn: async (body: { name: string; id: string; level: number }) => {
      const { data } = await api.post('/api/sub/categories', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error: AxiosError) => {
      notifications.show({
        title: 'Ошибка',
        message: error.message,
      })
    },
  })

  const patchCategory = useMutation({
    mutationFn: async (body: { name: string; id: string }) => {
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
    categories,
    categoriesPublic,
    addRootCategory: mutation.mutate,
    createSubCategory: createSubCategory.mutate,
    patchCategory: patchCategory,
    deleteCategory: deleteCategory,
  }
}
