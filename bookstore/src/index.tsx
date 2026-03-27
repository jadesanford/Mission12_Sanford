import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';

/*get root element from HTML*/
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

/*render app*/
root.render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);

/*measure performance*/
reportWebVitals();