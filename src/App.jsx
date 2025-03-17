//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const todos = [
    {id: 1, title: "Reading week-01 module"},
    {id: 2, title: "Attending Mentor session"},
    {id: 3, title: "ABCs of react-vite"},
  ]

  return (
    <div>
      <h1>My Todos</h1>
        <ul>
            {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
        </ul>
    </div>
  )
}

export default App
