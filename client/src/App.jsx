import { useState } from 'react'
import './App.css'
import LoginButton from './components/LoginButton'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <LoginButton />
  )
}

export default App
