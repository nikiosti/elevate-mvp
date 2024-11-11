'use client'
import { ActionIcon, AppShell, Burger, Button, Group, HoverCard, Text, TextInput, Title } from '@mantine/core'
import { UserRoundIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, PropsWithChildren } from 'react'

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()
  return (
    <AppShell
      header={{
        height: 190,
      }}
    >
      <AppShell.Header pt={100} px={32} bg="#e879f9" withBorder={false}>
        <Group h="100%" justify="space-between">
          <Link href="/">
            <Title order={3} c="white">
              Elevate MVP
            </Title>
          </Link>

          <Burger color="white" />

          <TextInput placeholder="Найти" size="xl" style={{ flexGrow: 1 }} />

          <ActionIcon variant="transparent" c="white" size="xl" onClick={() => router.push('/login')}>
            <UserRoundIcon />
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}

export default Wrapper
