/**
 * Algodoal Connect — SuperApp da Ilha de Algodoal
 * Produzido por 3facil.com (https://www.3facil.com)
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
