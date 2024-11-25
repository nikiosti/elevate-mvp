'use client'
import {
  AppShell,
  Button,
  Modal,
  Popover,
  Text,
  TextInput,
  TreeNodeData,
  UnstyledButton,
  Stack,
} from '@mantine/core'
import { FC, PropsWithChildren, useState } from 'react'
import { useCategories } from '@/hook/use-categories'

import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { User } from '@/components/admin/navbar/user/user.component'

import {
  Tree,
  MultiBackend,
  getBackendOptions
} from "@minoru/react-dnd-treeview";

const Page: FC<PropsWithChildren> = ({ children }) => {
  const { categories, addRootCategory, patchCategory, deleteCategory } = useCategories()
  const form = useForm({
    initialValues: {
      value: '',
    },
  })

  const [opened, { open, close }] = useDisclosure(false)
  const [name, setName] = useState<TreeNodeData>({ label: '', value: '' })

  const [treeData, setTreeData] = useState(categories)

  return (
    <>
      <Modal opened={opened} onClose={close}>
        <TextInput variant="filled" placeholder="Название" label="id" value={name.value as string} disabled />
        <TextInput
          variant="filled"
          placeholder="Название"
          label="Название"
          value={name.label as string}
          onChange={(e) => setName({ ...name, label: e.target.value })}
        />

        <Stack mt="xs" align="center">
          <Button
            fullWidth
            onClick={() => {
              patchCategory.mutate({ id: name.value, name: name.label as string })
              close()
            }}
          >
            Сохранить
          </Button>
          <UnstyledButton>
            <Text
              c="dimmed"
              size="sm"
              onClick={() => {
                deleteCategory.mutate({ id: name.value })
                close()
              }}
            >
              Удалить
            </Text>
          </UnstyledButton>
        </Stack>
      </Modal>
      <AppShell navbar={{ width: 300, breakpoint: 'xs' }}>
        <AppShell.Navbar p="xs">
          <AppShell.Section>
            <User />
          </AppShell.Section>

          <AppShell.Section grow>
            
          </AppShell.Section>
          <AppShell.Section>
            <Popover position="right" trapFocus>
              <Popover.Target>
                <Button fullWidth>Новая категория</Button>
              </Popover.Target>
              <Popover.Dropdown p={5}>
                <TextInput
                  placeholder="Название"
                  data-focused
                  size="sm"
                  {...form.getInputProps('value')}
                  rightSection={
                    <Button size="xs" onClick={() => addRootCategory({ name: form.values.value })}>
                      Сохранить
                    </Button>
                  }
                  rightSectionWidth={100}
                />
              </Popover.Dropdown>
            </Popover>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  )
}

export default Page
