'use client'
import { useUser } from '@/hook/use-user'
import { Text, Group, Avatar, ActionIcon } from '@mantine/core'
import { ChevronDown } from 'lucide-react'

export const User = () => {
  const { data: user } = useUser()

  return (
    <Group>
      <Avatar size="sm" allowedInitialsColors={['dark']} color="initials" name={user?.name} />
      <Text fw={600}>{user?.name}</Text>
      <ActionIcon variant="subtle">
        <ChevronDown strokeWidth={2} size={18} />
      </ActionIcon>
    </Group>
  )
}
