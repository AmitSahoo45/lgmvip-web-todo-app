import React from 'react'
import './NotFoundMessage.css'
import ErrorImg from '../../assets/something-went-wrong.png'

const NotFoundMessage = () => {
  return (
    <div>
      <img src={ErrorImg} alt='ErrorBody' className='ErrorImage' />
      <h4>No Tasks Found! Please add a task.</h4>
    </div>
  )
}

export default NotFoundMessage