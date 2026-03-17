import {useQuery} from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'
import ImageCard from './ImageCard'
import Recipe from './Recipe'


const STOP_WORDS = ['the', 'a', 'an', 'of', 'in', 'and', 'or', 'is', 'at', 'by', 'for', 'with', 'near',     
  'over', 'from', 'its', 'to', 'on', 'as']

  function extractKeywords(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')   // strip punctuation
      .split(' ')
      .filter(word => word.length > 2 && !STOP_WORDS.includes(word))
  }

export default function App() {
    const resultAPOD = useQuery({
      queryKey: ['apod'],
      queryFn: async () => {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}`)
        return res.json()
      }
    })
    const keywords = resultAPOD.data ? extractKeywords(resultAPOD.data.title) : []
    console.log(keywords)
    const resultMeal = useQuery({
      queryKey: ['meal', keywords],
      queryFn: () => searchMealByKeywords(keywords),
      enabled: keywords.length > 0
    })
    console.log(resultMeal)

  return (
    <>
      <div className="container-lg py-4">
        <header className="text-center py-4">
          <h1>Cosmic Pantry</h1>
          <h2>Today's space inspired recipe</h2>
        </header>
        <hr></hr>
        <ImageCard res={resultAPOD} />
        <Recipe rec={resultMeal.data}/>
        </div>
    </>
    
  )
}


  async function searchMealByKeywords(keywords) {
    for (const keyword of keywords) {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`)
      const data = await res.json()
      if (data.meals) return data.meals[0]  // first match wins
    }
    // fallback to random
    const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const data = await res.json()
    return data.meals[0]
  }



