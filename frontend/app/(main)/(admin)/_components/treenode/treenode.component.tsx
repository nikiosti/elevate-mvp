'use client'
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Image,
  Popover,
  RenderTreeNodePayload,
  Text,
  TextInput,
  TreeNodeData,
} from '@mantine/core'
import classes from './treenode.module.css'
import { useParams, useRouter } from 'next/navigation'

export const Treenode = ({ expanded, node, elementProps, hasChildren, level, tree }: RenderTreeNodePayload) => {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  return (
    <>
      <Group mt={10} wrap="nowrap" gap={1} className={classes.node} onClick={() => tree.toggleExpanded(node.value)}>
        <Group
          gap={8}
          wrap="nowrap"
          {...elementProps}
          onClick={() => {
            router.push(`/admin/category/${node.value}`)
          }}
        >
          {node.nodeProps?.type === 'title' && <Image className={classes.image} src={node.nodeProps.image} />}

          <Group wrap="nowrap">
            <Text lineClamp={1} data-active={id === node.value} className={classes.text}>
              {node.label}
            </Text>
          </Group>
        </Group>
      </Group>
    </>
  )
}
