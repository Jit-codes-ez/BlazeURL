import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import BackgroundLayout from './components/BackgroundLayout'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
    <BackgroundLayout>
    <SmoothScroll>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>

          <Footer />
      </div>
      </SmoothScroll>
      </BackgroundLayout>
    </BrowserRouter>
  )
}

export default App