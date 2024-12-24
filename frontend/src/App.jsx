import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";

// import 'bootstrap/dist/css/bootstrap.min.css';
import "./Styles/App.scss";

function App() {
  return (
    <div className="my-app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
