import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // ✅ Only importing App, not redefining it

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
