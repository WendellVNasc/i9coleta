import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import RoutesStack from './routes';

import './index.css';
import './assets/styles/dashboard.css'
import './assets/styles/assets.css'
import './assets/styles/perfil.css'
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider theme={{ components: {
      Slider: {
        handleColor: '#F33099',
        handleActiveColor: '#F33099'
      },
    }, }}>
      <RoutesStack />
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();
