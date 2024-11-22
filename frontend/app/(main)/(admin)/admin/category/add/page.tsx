'use client'

import { Container, Paper, TextInput } from '@mantine/core'

const Page = () => {
  return (
    <Container>
      <Paper withBorder mt={100} p="xl">
        <TextInput data-focus-ring variant="white" placeholder="Название категории" size="xl" />
      </Paper>
    </Container>
  )
}

export default Page
