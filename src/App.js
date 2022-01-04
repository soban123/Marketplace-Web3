import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import MarketPlace from "./marketPlace";
import MyNfts from "./my-nfts";
export default function App() {
 
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MarketPlace />} />
      <Route path="/my-nfts" element={<MyNfts />} />
    </Routes>
  </BrowserRouter>
   
  );
}
