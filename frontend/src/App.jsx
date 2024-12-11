import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Profile from "./Pages/Profile.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "./Styles/App.scss";
function App() {
  return (
    <div className="my-app">
      <Auth0Provider
        domain="dev-2zvnt7b3vewhots2.us.auth0.com"
        clientId="YOUR_CLIENT_ID"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </Auth0Provider>
    </div>
  );
}

export default App;
