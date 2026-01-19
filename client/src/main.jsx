import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css' //
import './index.css'

import App from './App.jsx'
import { AuthProvider } from './context/authContext.jsx'
import {SocketProvider} from './context/socketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
      
    </AuthProvider>
  </StrictMode>,
)
