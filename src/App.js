import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import MarketPlace from "./marketPlace";
export default function App() {
 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MarketPlace />} />
    </Routes>
  </BrowserRouter>
   
  );
}
