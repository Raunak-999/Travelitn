import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import ItineraryPlanner from './components/planner/ItineraryPlanner.tsx'
import TripSetup from './components/setup/TripSetup.tsx'
import ThemeProvider from './context/ThemeContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/setup" element={<TripSetup />} />
          <Route path="/planner" element={<ItineraryPlanner />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
