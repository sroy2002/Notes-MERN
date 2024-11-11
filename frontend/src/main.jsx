import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-2zvnt7b3vewhots2.us.auth0.com"
    clientId="g5DOHEUfgwJbDGg3PK6bh9Wi8MYDdBzv"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://my-notes-app",
      scope: "openid profile email",
    }}
  >
    <App />
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition: Bounce
    />
  </Auth0Provider>,
)
