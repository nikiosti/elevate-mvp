'use client'
import { useEffect, useState } from 'react'
import { useCategoryItems } from '@/hook/use-category-items'
import { Text, Box, Button, Paper, Group, Grid, Table } from '@mantine/core'
import { useParams } from 'next/navigation'
import { useDisclosure } from '@mantine/hooks'
import { ModalItem } from './_components/modal-item.component'

import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { useItems } from '@/hook/use-items'
import { useListState } from '@mantine/hooks'
import { LexoRank } from 'lexorank'

export default function DndTable() {
  const { id: paramsId } = useParams<{ id: string }>()
  const { categoryItems } = useCategoryItems(paramsId)
  const [opened, { close, open }] = useDisclosure(false)
  const [itemId, setItemId] = useState<string | undefined>(undefined)

  const openModal = (id: string) => {
    setItemId(id)
    open()
  }

  const { postItem, patchItem } = useItems(itemId)
  const [state, handlers] = useListState(categoryItems.data?.items)

  useEffect(() => {
    if (categoryItems.data?.items) handlers.setState(categoryItems.data.items)
  }, [categoryItems.data?.items])

  const handleDragEnd = async ({ source, destination }: DropResult) => {
    if (!destination || source.index === destination.index) return

    const sortablePayload = createSortablePayloadByIndex(state, source.index, destination.index)
    const newRank = getBetweenRankAsc(sortablePayload)

    const updatedItems = state.map((item) =>
      item.id === sortablePayload.entity.id ? { ...item, rank: newRank.toString() } : item
    )

    patchItem.mutate({ rank: newRank.toString(), id: sortablePayload.entity.id })
    handlers.setState(updatedItems.sort(sortByLexoRankAsc))
  }

  const items = state.map((item, index) => (
    <Draggable draggableId={item.id} index={index} key={item.id}>
      {(provided) => (
        <Table.Tr ref={provided.innerRef} {...provided.draggableProps}>
          <Table.Td>
            <div {...provided.dragHandleProps}>123</div>
          </Table.Td>
          <Table.Td miw={80}>{item.name}</Table.Td>
          <Table.Td miw={120}>{item.name}</Table.Td>
          <Table.Td miw={80}>{item.rank}</Table.Td>
          <Table.Td>{item.name}</Table.Td>
        </Table.Tr>
      )}
    </Draggable>
  ))

  return (
    <Table.ScrollContainer minWidth={420}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40} />
              <Table.Th w={80}>Position</Table.Th>
              <Table.Th w={120}>Name</Table.Th>
              <Table.Th w={40}>Symbol</Table.Th>
              <Table.Th>Mass</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <Table.Tbody {...provided.droppableProps} ref={provided.innerRef}>
                {items}
                {provided.placeholder}
              </Table.Tbody>
            )}
          </Droppable>
        </Table>
      </DragDropContext>
    </Table.ScrollContainer>
  )
}

export function getBetweenRankAsc(payload: any) {
  const { prevEntity, entity, nextEntity } = payload
  let newLexoRank: LexoRank
  if (!prevEntity && !!nextEntity) {
    newLexoRank = LexoRank.parse(nextEntity.rank).genPrev()
  } else if (!nextEntity && !!prevEntity) {
    newLexoRank = LexoRank.parse(prevEntity.rank).genNext()
  } else if (!!prevEntity && !!nextEntity) {
    newLexoRank = LexoRank.parse(nextEntity.rank).between(LexoRank.parse(prevEntity.rank))
  } else {
    newLexoRank = LexoRank.parse(entity.rank).genNext()
  }

  return newLexoRank
}

export function createSortablePayloadByIndex(items, oldIndex, newIndex) {
  let input
  const entity = items[oldIndex]
  if (newIndex === 0) {
    const nextEntity = items[newIndex]
    input = { prevEntity: undefined, entity: entity, nextEntity: nextEntity }
  } else if (newIndex === items.length - 1) {
    const prevEntity = items[newIndex]
    input = { prevEntity: prevEntity, entity: entity, nextEntity: undefined }
  } else {
    const prevEntity = items[newIndex]
    const offset = oldIndex > newIndex ? -1 : 1
    const nextEntity = items[newIndex + offset]
    input = { prevEntity: prevEntity, entity: entity, nextEntity: nextEntity }
  }

  return input
}

export function sortByLexoRankAsc(a, b): number {
  if (!a.rank && b.rank) {
    return -1
  }
  if (a.rank && !b.rank) {
    return 1
  }

  if (!a.rank || !b.rank) {
    return 0
  }

  return a.rank.localeCompare(b.rank)
}
