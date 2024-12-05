import React from 'react'

function Card(props) {
  return (
      <div>
          <h1>{props.name}</h1>
          <p>Email:{ props.email}</p>
    </div>
  )
}

export default Card