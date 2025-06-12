import React from 'react';
import ReactDOM from 'react-dom/client';

import RouterComponent from './router';

import './style/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterComponent />
  </React.StrictMode>
);