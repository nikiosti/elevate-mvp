'use client'

import api from '@/api/axios'
import { useCategories } from '@/hook/use-categories'
import { Avatar, Container, Group, Text } from '@mantine/core'
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone'
const Page = () => {
  const { categoriesPublic } = useCategories()

  return (
    <Container size="xl">
      <Group>
        {categoriesPublic?.map((category) => (
          <Group p="xs" key={category.value}>
            <Avatar
              name={String(category.label)}
              color="initials"
              allowedInitialsColors={['blue', 'red', 'cyan', 'indigo']}
            />
            <Text>{category.label}</Text>
          </Group>
        ))}
      </Group>

      <Dropzone
        onDrop={(files) => {
          const formData = new FormData()
          formData.append('name', '213321')
          formData.append('categoryId', '3d0d986b-8700-4c97-93fb-16cdb1204c06')
          formData.append('files', files[0])
          api.post('/api/public/item', formData)
        }}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>
    </Container>
  )
}
export default Page
