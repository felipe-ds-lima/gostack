import React from 'react'

export default function Header({children, title}) {
  return (
    <header>
      <h1>{title}</h1>

      {children}
    </header>
  )
}