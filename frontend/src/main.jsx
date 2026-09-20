import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

setupCache(axios, {
  ttl: 1000 * 60 * 5, // 5 minutes cache
  methods: ['get']
});
axios.defaults.baseURL = import.meta.env.PROD ? '' : 'http://localhost:3000';
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
