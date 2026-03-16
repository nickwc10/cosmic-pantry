import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'
import ImageCard from './ImageCard'

const queryClient = new QueryClient()

export default function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <header>
          <h1>Cosmic Pantry</h1>
          <h2>Today's space inspired recipe</h2>
        </header>
        <hr></hr>
        <ImageCard />
      </QueryClientProvider>
    </>
    
  )
}




