import { Button, ChakraProvider } from '@chakra-ui/react'
import React from 'react'

export default function Btn() {
  return (
    <ChakraProvider>
        <Button colorScheme='teal'>Hey</Button>
    </ChakraProvider>
  )
}
