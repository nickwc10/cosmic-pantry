import {useQuery} from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'
import ImageCard from './ImageCard'
import Recipe from './Recipe'


const STOP_WORDS = [
  // articles, prepositions, conjunctions
  'the', 'a', 'an', 'of', 'in', 'and', 'or', 'is', 'at', 'by', 'for', 'with', 'near',
  'over', 'from', 'its', 'to', 'on', 'as', 'off', 'are', 'how', 'was', 'full', 'can', 'then',
  'into', 'out', 'up', 'down', 'about', 'above', 'below', 'between', 'around', 'through',
  'across', 'along', 'among', 'within', 'without', 'toward', 'towards', 'upon', 'under',
  'after', 'before', 'since', 'until', 'while', 'although', 'because', 'though', 'yet',
  'but', 'nor', 'so', 'if', 'not', 'than', 'also', 'just', 'even', 'only', 'still',
  // pronouns
  'it', 'its', 'this', 'that', 'they', 'them', 'their', 'there', 'these', 'those',
  'which', 'what', 'when', 'where', 'who', 'our', 'your', 'his', 'her', 'we', 'you',
  'he', 'she', 'us', 'all', 'any', 'each', 'both', 'few', 'more', 'most', 'other',
  'some', 'such', 'one', 'two', 'three', 'many', 'much', 'very',
  // common verbs / auxiliaries
  'be', 'been', 'being', 'have', 'has', 'had', 'will', 'would', 'could', 'should',
  'may', 'might', 'do', 'did', 'does', 'get', 'got', 'let', 'make', 'made', 'use',
  'used', 'see', 'seen', 'show', 'shown', 'take', 'taken', 'come', 'came', 'look',
  'looks', 'appear', 'appears', 'known', 'called', 'named', 'located', 'captured',
  'visible', 'found', 'lies', 'sits'
]
const today = new Date().toISOString().split("T")[0] // used to prevent date input past today

  function extractKeywords(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')   // strip punctuation
      .split(' ')
      .filter(word => word.length > 2 && !STOP_WORDS.includes(word))
  }

export default function App() {
    const [date, setDate] = useState(today)
    const resultAPOD = useQuery({
      queryKey: ['apod', date],
      queryFn: async () => {
        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}&date=${date}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error?.message ?? `Request failed (${res.status})`)
        return data
      }
    })
    const keywords = resultAPOD.data?.title ? extractKeywords(resultAPOD.data.title) : []
    const descriptionKeywords = resultAPOD.data?.explanation ? extractKeywords(resultAPOD.data.explanation) : []
    const resultMeal = useQuery({
      queryKey: ['meal', keywords, descriptionKeywords],
      queryFn: () => searchMealByKeywords(keywords, descriptionKeywords),
      enabled: keywords.length > 0
    })

  return (
    <>
      <div className="container-lg py-4">
        <header className="text-center py-4">
          <h1>Cosmic Pantry</h1>
          <h2>Today's space inspired recipe</h2>
        </header>
        <hr></hr>
        <div className='card space-card mb-3 p-3'>
            <h3 className="card-title mb-3">About Cosmic Pantry</h3>
            <p className="card-text mb-2">Every day, NASA publishes an <strong>Astronomy Photo of the Day (APOD)</strong> - a stunning image of the cosmos accompanied by a short description written by an astronomer.</p>
            <p className="card-text mb-2">Cosmic Pantry uses the title and description of that photo to search for a matching recipe. Keywords are extracted and matched against The Meal Database, so if today's photo features the <em>Spanish Nebula</em> you might end up cooking something from that corner of the world.</p>
            <p className="card-text mb-0">Come back each day for a new photo and a new recipe inspiration from across the universe. You can also select a past date if you want more inspiration!</p>
        </div>
        <ImageCard res={resultAPOD} date={date} onDateChange={setDate} />
        <Recipe rec={resultMeal.data?.meal} matchedKeyword={resultMeal.data?.matchedKeyword} source={resultMeal.data?.source}/>
        </div>
    </>
    
  )
}


  async function searchMealByKeywords(keywords, descriptionKeywords = []) {
    for (const keyword of keywords) {
      const res = await fetch(`https://www.themealdb.com/api/json/v2/${import.meta.env.VITE_THE_MEAL_DB_API_KEY}/search.php?s=${keyword}`)
      const data = await res.json()
      if (data.meals) return { meal: data.meals[0], matchedKeyword: keyword, source: 'title' }
    }
    // fallback to description keywords
    for (const keyword of descriptionKeywords) {
      const res = await fetch(`https://www.themealdb.com/api/json/v2/${import.meta.env.VITE_THE_MEAL_DB_API_KEY}/search.php?s=${keyword}`)
      const data = await res.json()
      if (data.meals) return { meal: data.meals[0], matchedKeyword: keyword, source: 'description' }
    }
    // fallback to random
    const res = await fetch(`https://www.themealdb.com/api/json/v2/${import.meta.env.VITE_THE_MEAL_DB_API_KEY}/random.php`)
    const data = await res.json()
    return { meal: data.meals[0], matchedKeyword: null, source: 'random' }
  }



