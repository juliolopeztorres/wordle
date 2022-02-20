import React, { useContext } from 'react';

type Service = 'wordsRepository'
type Context = { [key in Service]: any }

const ContainerContext = React.createContext<Context | undefined>(undefined)

const container: Context = {
  'wordsRepository': 'myWordRepository'
}

const Container = ({children}: { children: React.ReactNode }) => <ContainerContext.Provider value={container}>
  {children}
</ContainerContext.Provider>

const useContainer = () => {
  const context = useContext(ContainerContext)

  if (!context) {
    throw new Error('Cannot get Container context :(')
  }

  return context
}

export {Container, useContainer}
