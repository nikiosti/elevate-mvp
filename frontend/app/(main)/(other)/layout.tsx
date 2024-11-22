'use client'
import { Search } from '@/components/search/search'
import { useCategories } from '@/hook/use-categories'
import {
  MantineShadow,
  AppShell,
  Button,
  Drawer,
  Group,
  HoverCard,
  Text,
  TextInput,
  UnstyledButton,
  SimpleGrid,
  Paper,
  Spoiler,
  Container,
  Indicator,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Heart, HeartIcon, MenuIcon, ShoppingCart, ShoppingCartIcon, X } from 'lucide-react'
import { FC, PropsWithChildren } from 'react'

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const [opened, { toggle: toggleCatalog, close: closeCatalog }] = useDisclosure(false)
  const { categoriesPublic } = useCategories()
  return (
    <>
      <AppShell
        header={{
          height: 120,
        }}
      >
        <AppShell.Header withBorder={false}>
          <Container size="xl">
            <Group h="100%" gap={20} justify="space-between" py="xl" wrap="nowrap">
              <UnstyledButton onClick={toggleCatalog}>
                <Group wrap="nowrap">
                  {opened ? <X /> : <MenuIcon />}

                  <Text fz="lg">Каталог</Text>
                </Group>
              </UnstyledButton>
              <Search />
              <UnstyledButton>
                <Group>
                  <HeartIcon />
                  <Text fz="lg">Желания</Text>
                </Group>
              </UnstyledButton>
              <UnstyledButton>
                <Group gap={15}>
                  <Indicator label="3" size="xs">
                    <ShoppingCartIcon />
                  </Indicator>
                  <div>
                    <Text fz="lg">Корзина</Text>
                    <Text fz="lg" c="dimmed">
                      44 BYN
                    </Text>
                  </div>
                </Group>
              </UnstyledButton>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Main pos="relative">
          <Drawer
            zIndex={1}
            opened={opened}
            onClose={toggleCatalog}
            position="top"
            overlayProps={{ backgroundOpacity: 0.3 }}
            styles={{ inner: { top: 120 } }}
          >
            <Container size="xl">
              <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, lg: 6 }} spacing="md">
                {categoriesPublic?.map((category) => (
                  <Paper radius={12} p="xs" h={100} withBorder key={category.value}>
                    <Text>{category.label}</Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </Container>
          </Drawer>
          {children}
        </AppShell.Main>
      </AppShell>
    </>
  )
}

export default Wrapper
