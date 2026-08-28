import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.jsx';
import AppProvider from './app/providers/app-provider/AppProvider.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
      <Toaster
        toastOptions={{
          duration: 5000,
        }}
      />
    </AppProvider>
  </StrictMode>,
);
