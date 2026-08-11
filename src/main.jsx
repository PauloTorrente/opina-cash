import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { StyledComponentsProvider } from './styles/StyledComponentsConfig';
import { LanguageProvider } from './i18n/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <StyledComponentsProvider>
          <App />
        </StyledComponentsProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
