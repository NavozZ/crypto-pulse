import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './HomePage'
import RootLayout from './components/layouts/root-layout.page';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage/>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              
              </Route>
            

          
          </Routes>
        </BrowserRouter>
      
    
  </StrictMode>,
)
