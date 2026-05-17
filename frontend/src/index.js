import React from 'react';
import ReactDOM from 'react-dom/client';
import './styling/index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import Context from './context/Auth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Context>
      <App />
    </Context>
  </BrowserRouter>
);