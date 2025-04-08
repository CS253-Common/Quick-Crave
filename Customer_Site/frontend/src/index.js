import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Suppress error overlay
window.addEventListener('error', (event) => {
  event.preventDefault();
  console.log('Caught error:', event.error);
  return false;
});

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  console.log('Caught promise rejection:', event.reason);
  return false;
});

// Debug .env
console.log("FAST_REFRESH:", process.env.FAST_REFRESH);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App /> // Keep StrictMode disabled for now
);

reportWebVitals();