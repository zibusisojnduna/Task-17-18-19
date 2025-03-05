import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Add from "./components/add";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Add/>
    </>
  )
}

export default App
