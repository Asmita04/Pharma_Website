import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

function useCartCount() {
  const { pathname } = useLocation();
  const [count, setCount] = useState(0);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCount(saved.length);
  }, [pathname]);
  return count;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cartCount = useCartCount();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // redirect to home
  };

  const closeOnNav = () => setOpen(false);

  return (
    <header className="mc-navbar shadow-sm sticky-top bg-white">
      <nav className="container d-flex align-items-center justify-content-between py-2">
        {/* Brand */}
        <Link to="/" className="brand d-flex align-items-center gap-2" onClick={closeOnNav}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 21s-6.5-4.35-9.2-7.04A5.8 5.8 0 1 1 12 5.3a5.8 5.8 0 1 1 9.2 8.66C18.5 16.65 12 21 12 21z"
              fill="currentColor" />
          </svg>
          <span className="brand-text">MediCure</span>
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className="navbar-toggler d-lg-none"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Links */}
        <div className={`nav-links ${open ? "show" : ""}`}>
          <ul className="list-unstyled d-lg-flex align-items-center gap-lg-3 m-0">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeOnNav}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeOnNav}>Medicines</NavLink>
            </li>
            <li><NavLink
                to="/findDoctors"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={closeOnNav}
              >
                Find Doctors
              </NavLink></li>
            <li><span className="nav-link disabled-link">Records</span></li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeOnNav}>Contact Us</NavLink>
            </li>
          </ul>
        </div>

        {/* Right actions */}
        <div className="actions d-flex align-items-center gap-2">
          <Link to="/cart" className="cart-btn" title="Cart" onClick={closeOnNav} aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M7 4h-2l-1 2m0 0 2.4 9.6A2 2 0 0 0 8.33 17h8.9a2 2 0 0 0 1.94-1.55L21 8H5M10 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {/* ✅ Login / Logout toggle */}
          {isLoggedIn ? (
            <button className="btn btn-brand" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className="btn btn-brand" onClick={closeOnNav}>Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
