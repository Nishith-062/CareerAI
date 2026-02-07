import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.tsx'
import AuthProvider from './providers/AuthProvider.tsx'
createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <ThemeProvider defaultTheme="dark">
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
</StrictMode>

)
