import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import fallbackImg from './assets/SpanishDancer_Hubble_960.jpg'

export default function ImageCard({res}){


  const [imageSrc, setImageSrc] = useState(fallbackImg)
  const { title, date, explanation, url, media_type, copyright } = res.data || {}
  useEffect(() => {
    if (url) setImageSrc(url)
  }, [url])
  if(res.isLoading) return <div>Loading...</div>
  if(res.isError) return <div>Error: {res.error.message}</div>


  const handleImageError = () => {
    setImageSrc(fallbackImg)
  }

  return (
    <div className='card text-bg-dark mb-3' id='image-card'>
        <img src={imageSrc} alt={title} className='card-img object-fit-cover' onError={handleImageError} style={{height: '500px', width: '100%'}}/>
        <div className='card-img-overlay d-flex flex-column justify-content-center'>
            <div className='card bg-dark bg-opacity-50 p-3 text-bg-dark rounded mb-3 mx-auto'>
                <h2 className='card-text text-center'>{title}</h2>
            </div>
        </div>
        <div className='card position-absolute top-0 start-0 m-2 px-2 py-1 bg-dark bg-opacity-50 text-bg-dark rounded'>
            Source: NASA APOD on {date}
        </div>
    </div>
  )
}