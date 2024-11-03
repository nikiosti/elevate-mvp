'use client'

import api from '@/api/axios'
import { usePosts } from '@/hook/use-posts'
import { Button, Paper, Text, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()

  const { data: posts } = usePosts()
  const logout = async () => {
    await api.post('http://localhost:3001/auth/logout')
    router.push('/login')
  }

  return (
    <div>
      {posts?.map((post: { id: string; title: string; content: string }) => (
        <Paper withBorder p="xs" key={post.id} mb="sm" w={300}>
          <Title order={3}>{post?.title}</Title>
          <Text>{post?.content}</Text>
        </Paper>
      ))}
    </div>
  )
}
export default Page
