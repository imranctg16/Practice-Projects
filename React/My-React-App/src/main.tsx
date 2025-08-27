import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Basic from './Basic.tsx'
// import App from './App-Simple.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Basic /> */}
    <App />
  </StrictMode>,
)
