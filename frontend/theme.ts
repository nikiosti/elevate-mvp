'use client'
import { Button, createTheme, TextInput, Title } from '@mantine/core'
import classes from './theme.module.css'
export const theme = createTheme({
  colors: {},
  components: {
    Button: Button.extend({
      defaultProps: {
        color: '#a8a29e',
        radius: 100,
      },
    }),
    TextInput: TextInput.extend({
      classNames: {
        input: classes.input,
      },
    }),
  },
})
