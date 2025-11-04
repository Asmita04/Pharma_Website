import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// src/App.jsx
import { Routes, Route, NavLink, BrowserRouter } from "react-router-dom";
import MedicineShop from "./pages/MedicineShop.jsx"; // <-- your page component
import CartPage from "./pages/CartPage.jsx";
import Navbar from "./components/Navbar";
import FindDoctors from './pages/FindDoctors.jsx';

function Home() {
  return (
    <div className="container py-5">
      <h2 className="text-brand">Welcome to MediCure</h2>
      <p>Home page content here.</p>
    </div>
  );
}

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<MedicineShop />} />   {/* <-- here */}
        <Route path="/findDoctors" element={<FindDoctors/>} />
        <Route path="/cart" element={<CartPage />} />
        {/* add more routes as you build */}
      </Routes>
    </>
  );
}





