import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import ScrollToTop from './components/ScrollToTop'
import WelcomeLayout from './components/WelcomeLayout'
import BackgroundLayout from './components/BackgroundLayout'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import GoogleAuth from './pages/GoogleAuth'

import Dashboard from './pages/Dashboard'
import URLExpiredPage from './pages/UrlExpiredPage'
import URLNotFoundPage from './pages/UrlNotFoundPage'
import PrivacyPolicy      from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import PageNotFound from './pages/NotFoundPage'
import ServerErrorPage    from './pages/ServerErrorPage'
import OfflinePage        from './pages/OfflinePage'
import SessionExpiredPage from './pages/SessionExpiredPage'

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
    <WelcomeLayout />
    <BackgroundLayout>
    <SmoothScroll>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<GoogleAuth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Necessary routes for error handling and other pages */}
              <Route path="/error404" element={<URLNotFoundPage />} />
              <Route path="/error410" element={<URLExpiredPage />} />
              <Route path="/not-found" element={<PageNotFound />} />
              <Route path="/server-error" element={<ServerErrorPage />} />
              <Route path="/offline" element={<OfflinePage />} />
              <Route path="/session-expired" element={<SessionExpiredPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
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