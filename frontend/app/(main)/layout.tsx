'use client'
import { AppShell, Burger, Button, Group, HoverCard, Text, TextInput, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import { FC, PropsWithChildren, useState } from 'react'

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure(false)
  const [state, setState] = useState(250)
  return (
    <AppShell
      header={{
        height: 90,
      }}
      navbar={{ width: state, breakpoint: 'xs', collapsed: { desktop: !opened, mobile: !opened } }}
    >
      <AppShell.Header px={32}>
        <Group h="100%" justify="space-between">
          <Title order={3}>
            <Link href="/">Elevate MVP</Link>
          </Title>

          <Burger opened={opened} onClick={toggle} />

          <TextInput
            styles={{ input: { backgroundColor: '#E1E1E1' } }}
            placeholder="Найти"
            size="xl"
            style={{ flexGrow: 1 }}
          />

          <Group>
            <Text>
              <Link href="/login">Войти</Link>
            </Text>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Button onClick={() => setState(300)}>больще</Button>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}

export default Wrapper
