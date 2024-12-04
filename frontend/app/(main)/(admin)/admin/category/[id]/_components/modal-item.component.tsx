'use client'
import { useItems } from '@/hook/use-items'
import { Modal, ModalProps, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Item } from '@prisma/client'
import { useEffect } from 'react'
export const ModalItem = (props: ModalProps & { id?: string }) => {
  const { item, patchItem } = useItems(props.id!)
  const form = useForm<Item>({
    initialValues: item.data,
  })

  useEffect(() => {
    if (item.data) {
      form.setValues(item.data)
    }
  }, [item.data])

  return (
    <Modal {...props}>
      <TextInput
        disabled={item.isPending}
        label="Название"
        {...form.getInputProps('name')}
        onBlur={() => {
          patchItem.mutate({ name: form.values.name })
        }}
      />
    </Modal>
  )
}
