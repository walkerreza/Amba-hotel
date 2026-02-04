// Import library dan komponen yang diperlukan
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Render aplikasi React ke dalam DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictMode membantu mendeteksi potensi masalah dalam aplikasi
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
