import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@fluentui/react';

import App from './app/App';

const lightTheme = {
  palette: {
  }
};

const app = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter>
      <ThemeProvider applyTo="body" theme={lightTheme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>, app);
  