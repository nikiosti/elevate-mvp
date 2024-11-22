'use client'

import { TextInput, TextInputProps } from '@mantine/core'
import classes from './classes.module.css'
import { Search as SearchIcon } from 'lucide-react'
export const Search = (props: TextInputProps) => {
  return (
    <div className={classes.wrapperBox}>
      <TextInput size="xl" leftSection={<SearchIcon />} placeholder="Поиск" {...props} classNames={classes} />
    </div>
  )
}
