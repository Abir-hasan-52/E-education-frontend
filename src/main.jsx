import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { router } from './router/router.jsx'
import { RouterProvider } from 'react-router'
import AuthProvider from './contexts/AuthContext/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <div className='poppins-regular '>
      <AuthProvider>
         <RouterProvider router={router} />
      </AuthProvider>
     </div>
  </StrictMode>,
)
