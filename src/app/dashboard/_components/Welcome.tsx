import React from 'react'

interface props{
  name:string
}

export default function Welcome({name}:props) {
  return (
    <div className='max-w-full'>
      <div className='text-center'>
        <p className='text-4xl  font-serif'>Hello, {name}</p>
      </div>
    </div>
  )
}
