import { Box, Button, Drawer, Group, Image, Menu, ScrollArea, Text, TextInput, Title } from '@mantine/core'
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import classes from './add-category-drawer.module.css'
import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { useCategories } from '@/hook/use-categories'
import { useForm } from '@mantine/form'
interface AddCategoryDrawerProps {
  onClose: () => void
  opened: boolean
}
export const AddCategoryDrawer = ({ onClose, opened }: AddCategoryDrawerProps) => {
  const { createCategory } = useCategories()

  const form = useForm<{ name: string; files: FileWithPath[] }>({
    initialValues: {
      name: '',
      files: [],
    },
  })

  const previews = form.values.files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file)
    return <Image className={classes.preview} key={index} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
  })

  return (
    <Drawer position="right" onClose={onClose} opened={opened} offset={32} size={980} radius={30}>
      <Group wrap="nowrap" align="flex-start" gap={24}>
        <Box>
          <Dropzone
            onDrop={(files) => form.setFieldValue('files', files)}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={15 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            className={classes.dropzone}
          >
            {!Boolean(form.values.files) && (
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
            )}
            {previews}
          </Dropzone>
        </Box>
        <Box w="100%">
          <TextInput radius="18" size="xl" placeholder="Название" {...form.getInputProps('name')} />

          <Menu
            position="bottom-start"
            width={206}
            styles={{
              dropdown: {
                borderRadius: 18,
              },
              item: {
                borderRadius: 12,
              },
            }}
          >
            <Menu.Target>
              <Button bg="#f2f2f2" leftSection={<PlusIcon size={18} />} mt="xs">
                Детальное описание
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Текст</Menu.Item>
              <Menu.Item>Изображение</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button
            pos="absolute"
            bottom={15}
            size="xl"
            onClick={() => {
              const formData = new FormData()
              for (const key in form.values) {
                if (form.values.hasOwnProperty(key)) {
                  const value = form.values[key as keyof typeof form.values]
                  if (Array.isArray(value)) {
                    formData.append(key, value[0])
                  } else {
                    formData.append(key, value as string)
                  }
                }
              } 

              createCategory.mutate(formData)
            }}
          >
            Сохранить
          </Button>
        </Box>
      </Group>
    </Drawer>
  )
}
