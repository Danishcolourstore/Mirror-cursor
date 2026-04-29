import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import HtmlThemeSync from './components/studio/HtmlThemeSync'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <>
        <HtmlThemeSync />
        <App />
      </>
    </BrowserRouter>
  </StrictMode>,
)
