import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HomePage from './HomePage'
import RootLayout from './components/layouts/root-layout.page';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage/>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route for future implementation */}
              
              </Route>
            

          
          </Routes>
        </BrowserRouter>
      
    
  </StrictMode>,
)
