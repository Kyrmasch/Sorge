import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app/App';

const app = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>, app);
  