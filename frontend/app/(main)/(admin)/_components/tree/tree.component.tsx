'use client'

import { useCategories } from '@/hook/use-categories'
import { Tree as TreeMantine } from '@mantine/core'
import { Treenode } from '../treenode/treenode.component'
export const Tree = () => {
  const { categories } = useCategories()

  return (
    <TreeMantine levelOffset={40} expandOnSpace={false} expandOnClick={false} data={categories} renderNode={Treenode} />
  )
}
