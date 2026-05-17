import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'katex/dist/katex.min.css';
import './styles.css';

const App = React.lazy(() => import('./App.jsx'));

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="app-loader"><span />MathGlow is opening...</div>}>
      <App />
      <Analytics />
    </React.Suspense>
  </React.StrictMode>
);
