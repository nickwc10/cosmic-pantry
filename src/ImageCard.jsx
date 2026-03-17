import { useEffect, useState } from 'react'
import fallbackImg from './assets/SpanishDancer_Hubble_960.jpg'

const today = new Date().toISOString().split('T')[0]

export default function ImageCard({res, date, onDateChange}){
  const [imageSrc, setImageSrc] = useState(fallbackImg)
  const [inputDate, setInputDate] = useState(date)
  const { title, date: apodDate, explanation, url, media_type, copyright } = res.data || {}

  useEffect(() => {
    if (url) setImageSrc(url)
  }, [url])

  if(res.isLoading) return <div>Loading...</div>
  if(res.isError) return <div>Error: {res.error.message}</div>

  const handleImageError = () => {
    setImageSrc(fallbackImg)
  }

  return (
    <div className='card border-0 mb-3' style={{borderRadius: '1rem'}}>
      <div className='position-relative' style={{borderRadius: '1rem', overflow: 'hidden'}}>
        <img src={imageSrc} alt={title} className='card-img object-fit-cover' onError={handleImageError} style={{height: '500px', width: '100%'}}/>
        <div className='card-img-overlay d-flex flex-column justify-content-end' style={{background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)'}}>
            <h2 className='card-title text-white fw-bold mb-1'>{title}</h2>
            <small className='text-white-50'>NASA APOD — {apodDate}{copyright && ` — © ${copyright}`}</small>
        </div>
        <div className='position-absolute top-0 end-0 p-3 d-flex align-items-center gap-2'>
          <input
            type="date"
            className="form-control form-control-sm w-auto"
            min="1995-06-16"
            max={today}
            value={inputDate}
            onChange={e => setInputDate(e.target.value)}
          />
          <button className="btn btn-outline-light btn-sm" onClick={() => onDateChange(inputDate)}>Go</button>
        </div>
      </div>
    </div>
  )
}
