import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RegistroCliente from './Registrate.jsx'
import Bienvenido from './Bienvenido.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Bienvenido />
  </StrictMode>,
)
