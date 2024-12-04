'use client'
import { ActionIcon, Button, createTheme, Drawer, Group, Text, Title } from '@mantine/core'
export const theme = createTheme({
  primaryColor: 'dark',

  components: {
    Button: Button.extend({
      defaultProps: {
        radius: 100,
        c: '#595959',
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
        c: '#595959',
        fz: 14,
        fw: 600,
      },
    }),
    Title: Text.extend({
      defaultProps: {
        c: '#595959',
        fz: 24,
        fw: 600,
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
