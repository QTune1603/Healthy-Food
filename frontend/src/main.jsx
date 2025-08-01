import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import reportWebVitals from './reportWebVitals.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

//Gọi hàm để báo cáo các chỉ số web vitals
reportWebVitals();
