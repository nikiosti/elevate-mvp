import api from '@/api/axios'
import { LoginForm } from '@/app/(main)/(other)/(auth)/login/types'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

const post = async (body: LoginForm) => {
  const { data } = await api.post('/auth/login', body)

  return data
}

export const useLogin = () => {
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: (body: LoginForm) => post(body),
    onSuccess: () => {
      router.push('/')
    },
  })

  return mutation
}
