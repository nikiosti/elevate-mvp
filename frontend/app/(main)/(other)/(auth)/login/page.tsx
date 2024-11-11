'use client'
import { useRouter } from 'next/navigation'

import { Paper, Button, Title, Center, Container, TextInput, Stack, Box, Text, UnstyledButton } from '@mantine/core'
import classes from './page.module.css'
import { useForm } from '@mantine/form'
import { LoginForm } from './types'
import { useLogin } from '@/hook/use-login'

const Home = () => {
  const router = useRouter()
  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
  })

  const { mutate: login } = useLogin()
  return (
    <Container className={classes.wrapper}>
      <Paper className={classes.container} radius={12} py={50}>
        <Title order={1} className={classes.title} ta="center">
          Вход
        </Title>

        <Center>
          <Box w="100%" maw={350} mt={75}>
            <TextInput variant="filled" size="lg" placeholder="Электропочта" {...form.getInputProps('email')} />
            <TextInput variant="filled" size="lg" mt="xs" placeholder="Пароль" {...form.getInputProps('password')} />

            <Stack gap="xs" mt={50} justify="stretch">
              <Button size="lg" variant="filled" radius={100} onClick={() => login(form.values)}>
                Войти
              </Button>
              <Button
                size="lg"
                variant="light"
                radius={100}
                onClick={() => router.push('http://localhost:3001/auth/google')}
              >
                Войти через Google
              </Button>

              <UnstyledButton>
                <Text mt="sm" ta="center" c="dimmed">
                  Восстановить пароль
                </Text>
              </UnstyledButton>
            </Stack>
          </Box>
        </Center>
      </Paper>
    </Container>
  )
}

export default Home
