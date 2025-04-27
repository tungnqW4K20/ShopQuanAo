import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import { Link, Route, Routes } from 'react-router-dom'
import Header from './component/Header'
import Footer from './component/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
