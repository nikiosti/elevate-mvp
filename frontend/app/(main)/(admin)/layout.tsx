'use client'
import {
  ActionIcon,
  AppShell,
  Button,
  Group,
  Modal,
  Popover,
  RenderTreeNodePayload,
  Text,
  TextInput,
  Tree,
  Box,
  TreeNodeData,
  UnstyledButton,
  Stack,
  Loader,
} from '@mantine/core'
import { FC, PropsWithChildren, useState } from 'react'
import { useCategories } from '@/hook/use-categories'
import { ChevronDown, Ellipsis, Plus } from 'lucide-react'
import classes from './layout.module.css'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'

const Page: FC<PropsWithChildren> = ({ children }) => {
  const { categories, createSubCategory, addRootCategory, patchCategory, deleteCategory } = useCategories()
  const form = useForm({
    initialValues: {
      value: '',
    },
  })

  const [opened, { open, close }] = useDisclosure(false)
  const [name, setName] = useState<TreeNodeData>({ label: '', value: '' })

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
        <AppShell.Navbar>
          <AppShell.Section grow>
            <Tree
              levelOffset={10}
              expandOnSpace={false}
              data={categories || []}
              renderNode={({ expanded, node, elementProps, hasChildren, level }: RenderTreeNodePayload) => {
                return (
                  <Group gap={1} className={classes.node} wrap="nowrap" justify="space-between" h={40}>
                    <Group gap={1} w="100%" wrap="nowrap" {...elementProps} h="100%">
                      {hasChildren ? (
                        <ChevronDown
                          strokeWidth={2}
                          size={18}
                          style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(270deg)' }}
                        />
                      ) : (
                        <Box w={18} />
                      )}
                      <Group>
                        <Text lineClamp={1}>{node.label}</Text>
                        {(deleteCategory.isPending || patchCategory.isPending) && node.value === name.value && (
                          <Loader size={15} color="dimmed" />
                        )}
                      </Group>
                    </Group>
                    <ActionIcon
                      c="black"
                      variant="transparent"
                      onClick={() => {
                        open()
                        setName(node)
                      }}
                    >
                      <Ellipsis strokeWidth={2} size={18} className={classes.action} />
                    </ActionIcon>
                    <Popover trapFocus position="right">
                      <Popover.Target>
                        <ActionIcon c="black" variant="transparent">
                          <Plus strokeWidth={2} size={18} className={classes.action} />
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown p={5}>
                        <TextInput
                          placeholder="Название"
                          data-focused
                          size="sm"
                          {...form.getInputProps('value')}
                          rightSection={
                            <Button
                              color="#a8a29e"
                              size="xs"
                              onClick={() => {
                                createSubCategory({ name: form.values.value, id: node.value, level })
                              }}
                            >
                              Сохранить
                            </Button>
                          }
                          rightSectionWidth={100}
                        />
                      </Popover.Dropdown>
                    </Popover>
                  </Group>
                )
              }}
            />
          </AppShell.Section>
          <AppShell.Section p={10}>
            <Popover position="right" trapFocus>
              <Popover.Target>
                <Button fullWidth>Новая категория</Button>
              </Popover.Target>
              <Popover.Dropdown p={5}>
                <TextInput
                  placeholder="Название"
                  data-focused
                  size="xs"
                  {...form.getInputProps('value')}
                  rightSection={
                    <Button color="#a8a29e" size="xs" onClick={() => addRootCategory({ name: form.values.value })}>
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
