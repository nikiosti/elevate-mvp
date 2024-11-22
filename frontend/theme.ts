'use client'
import { ActionIcon, Button, createTheme, Drawer, Group, Text } from '@mantine/core'
export const theme = createTheme({
  primaryColor: 'dark',

  components: {
    Button: Button.extend({
      defaultProps: {
        radius: 100,
      },
    }),
    Drawer: Drawer.extend({
      defaultProps: {
        shadow: '0',
        withCloseButton: false,
      },
    }),
    Group: Group.extend({
      defaultProps: {
        gap: '0,8px',
      },
    }),
    Text: Text.extend({
      defaultProps: {
        c: '#000000',
        fz: 'lg',
      },
    }),

    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
        size: 'xs',
        c: '#45433e',
      },
    }),
  },
})
