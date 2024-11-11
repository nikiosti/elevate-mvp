'use client'
import api from '@/api/axios'
import { useUser } from '@/hook/use-user'
import { Button, Text, TreeNodeData, UnstyledButton } from '@mantine/core'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const logout = async () => {
    await api.post('http://localhost:3001/auth/logout')
    router.push('/login')
  }

  const { data: user } = useUser()

  return (
    <div>
      <Text fw="bold">{user?.name}</Text>
      <Text>{user?.email}</Text>

      <UnstyledButton onClick={logout}>
        <Text>Выйти</Text>
      </UnstyledButton>
    </div>
  )
}
export default Page
