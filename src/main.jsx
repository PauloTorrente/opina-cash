import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { StyledComponentsProvider } from './styles/StyledComponentsConfig';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StyledComponentsProvider>
        <App />
      </StyledComponentsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
