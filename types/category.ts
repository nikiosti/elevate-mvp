import { Category } from '@prisma/client'
import { TreeNodeData } from '@mantine/core'
export type CategoryWithChildren = Category & {
  children: CategoryWithChildren[]
}

export interface Categories extends TreeNodeData {
  nodeProps: { type: string }
}
