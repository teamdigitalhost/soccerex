import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Europe2026 from './pages/Europe2026'
import PressRelease from './pages/PressRelease'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/europe-2026" element={<Europe2026 />} />
        <Route path="/press/:slug" element={<PressRelease />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
