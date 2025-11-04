// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MedicineShop from "./pages/MedicineShop";
import CartPage from "./pages/CartPage";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import FindDoctors from "./pages/FindDoctors";
import Signup from "./pages/Signup";
import "./App.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";  

function Layout() {
  const location = useLocation();

  // Hide navbar on login/signup
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<MedicineShop />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/findDoctors" element={<FindDoctors/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  );
}

export default Layout;
