import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import RoutesStack from './routes';
import { ConfigProvider } from 'antd';

import './index.css';
import './assets/styles/dashboard.css'
import './assets/styles/assets.css'
import './assets/styles/perfil.css'
import "leaflet/dist/leaflet.css";
import { setDefaults } from 'react-geocode';


const options:any = {
  key: "AIzaSyAlx0Z2HZQLTIpKSxmACGhpXl6Sz1daSaw",
  language: "pt-BR",
  region: 'br'
}

setDefaults(options)

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
