import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Import custom styles (optional if you're using Tailwind CDN)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
