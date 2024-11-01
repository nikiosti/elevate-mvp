'use client'

import api from '@/api/axios'
import { usePosts } from '@/services/api/hook/use-posts'
import { Button, Paper, Text, Title } from '@mantine/core'
import Link from 'next/link'

const Page = () => {
  const { data: posts } = usePosts()

  return (
    <div>
      <>
        {posts && posts.length > 0 ? (
          posts.map((post: { id: string; title: string; content: string }) => (
            <Paper withBorder p="xs" key={post.id} mb="sm">
              <Title order={3}>{post.title}</Title>
              <Text>{post.content}</Text>
            </Paper>
          ))
        ) : (
          <div>
            <Text>Нет доступных постов  <Link href='/login'>войти</Link></Text>
            <Button
              onClick={async () => {
                const res = await api.post('/auth/google/refresh')
                return res
              }}
            >
              Обновить токен
            </Button>
          </div>
        )}
      </>
    </div>
  )
}
export default Page
