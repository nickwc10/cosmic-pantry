import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import fallbackImg from './assets/SpanishDancer_Hubble_960.jpg'

export default function ImageCard(){

  const result = useQuery({
    queryKey: ['apod'],
    queryFn: async () => {
      const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      return res.json()
    }
  })
  const [imageSrc, setImageSrc] = useState('./assets/SpanishDancer_Hubble_960.jpg')
  if(result.isLoading) return <div>Loading...</div>
  if(result.isError) return <div>Error: {result.error.message}</div>
  const { title, date, explanation, url, media_type, copyright } = result.data || {title: 'Spanish Dancer', date: '16MAR2026', explanation: '', url: './assets/SpanishDancer_Hubble_960.jpg', media_type: 'image', copyright: ''}


  const handleImageError = () => {
    setImageSrc('./assets/SpanishDancer_Hubble_960.jpg')
  }


  return (
    <div className='card text-bg-dark'>
        <img src={imageSrc} alt={title} className='card-img' onError={handleImageError}/>
        <div className='card-img-overlay'>
            <h5 className='card-title'>{title}</h5>
            <p className='card-text'>{explanation}</p>
            <p className='card-footer'>{date} {copyright && `- ${copyright}`}</p>
        </div>
    </div>
  )
}