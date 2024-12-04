'use client'
import {
  ActionIcon,
  AppShell,
  Button,
  Group,
  Modal,
  Text,
  TextInput,
  TreeNodeData,
  UnstyledButton,
  Stack,
  Box,
} from '@mantine/core'
import { FC, PropsWithChildren, useState } from 'react'
import { useCategories } from '@/hook/use-categories'
import { Plus } from 'lucide-react'
import classes from './layout.module.css'
import { useDisclosure } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import { Tree } from './_components/tree/tree.component'
import { AddCategoryDrawer } from './_components/add-category-drawer/add-category-drawer.component'
const Page: FC<PropsWithChildren> = ({ children }) => {
  const { categories, createSubCategory, addRootCategory, patchCategory, deleteCategory } = useCategories()
  const [name, setName] = useState<TreeNodeData>({ label: '', value: '' })

  const router = useRouter()
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal onClose={close}>
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
      <AppShell navbar={{ width: 252, breakpoint: 'xs' }} bg="#F2F2F2">
        <AppShell.Navbar className={classes.navbar}>
          <AppShell.Section>
            <Group justify="space-between">
              <Text size="xs" c="#a6a6a6">
                Категории
              </Text>
              <ActionIcon size="xs" onClick={open}>
                <Plus color="#595959" />
              </ActionIcon>
            </Group>
          </AppShell.Section>
          <AppShell.Section>
            <Tree />
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>
          <Box p={32}>{children}</Box>
        </AppShell.Main>
      </AppShell>

      <AddCategoryDrawer onClose={close} opened={opened} />
    </>
  )
}

export default Page
