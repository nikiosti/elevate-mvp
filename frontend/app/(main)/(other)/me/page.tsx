'use client'
import { useCategories } from '@/hook/use-categories'
import {
  ActionIcon,
  Button,
  FocusTrap,
  Group,
  Menu,
  Popover,
  RenderTreeNodePayload,
  TextInput,
  Tree,
  useTree,
} from '@mantine/core'
import { ChevronDown, Plus } from 'lucide-react'

export default function Demo() {
  const { categories } = useCategories()

  return (
    <>
      <Tree
        expandOnSpace={false}
        data={categories || []}
        renderNode={({ expanded, node, elementProps, hasChildren }: RenderTreeNodePayload) => {
          return (
            <Group gap={1}>
              <Group gap={1} {...elementProps}>
                {hasChildren && (
                  <ChevronDown
                    strokeWidth={1.2}
                    size={18}
                    style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                )}

                <span>{node.label}</span>
              </Group>

              <Popover trapFocus position="right">
                <Popover.Target>
                  <ActionIcon c="black" variant="transparent">
                    <Plus strokeWidth={1.2} size={18} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown p={5}>
                  <TextInput placeholder="Название" data-focused size="xs" />
                </Popover.Dropdown>
              </Popover>
            </Group>
          )
        }}
      />
    </>
  )
}
