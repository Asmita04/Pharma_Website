import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center text-center text-light">
        <div className="container">
          <h1 className="display-4 fw-bold animate-fade">Your Health, Our Priority</h1>
          <p className="lead mt-3">
            Trusted medicines and compassionate care for every family.
          </p>

          {/* ✅ Conditional Login/Logout Button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="btn btn-danger mt-4 shadow-lg"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="btn btn-brand mt-4 shadow-lg"
            >
              Login
            </button>
          )}
        </div>
      </section>

      {/* About Our Products Section */}
      <section className="about-products py-5 bg-light">
        <div className="container text-center">
          <h2 className="text-brand mb-4">Our Products</h2>
          <p className="lead mb-5">
            We bring the best healthcare products to your doorstep — quality, trust, and innovation combined.
          </p>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card card-hover border-0 shadow-lg p-3">
                <img src="/images/herbal.jpg" className="rounded-top" alt="Herbal Medicines" />
                <div className="card-body">
                  <h5>Herbal Medicines</h5>
                  <p>Natural remedies crafted with science for holistic healing.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-hover border-0 shadow-lg p-3">
                <img src="/images/vitamin.jpg" className="rounded-top" alt="Vitamins & Supplements" />
                <div className="card-body">
                  <h5>Vitamins & Supplements</h5>
                  <p>Boost immunity and energy with doctor-recommended nutrition.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-hover border-0 shadow-lg p-3">
                <img src="/images/healthdevice.jpg" className="rounded-top" alt="Health Devices" />
                <div className="card-body">
                  <h5>Health Devices</h5>
                  <p>Accurate digital thermometers, BP monitors, and more.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Tips & Awareness Section */}
      <section className="health-tips text-center py-5">
        <div className="container">
          <h2 className="text-brand mb-4">Health Tips & Awareness</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="tip-card shadow-lg p-4 rounded-4">
                <i className="bi bi-heart-pulse-fill text-danger fs-2 mb-3"></i>
                <h5>Stay Active</h5>
                <p>Engage in at least 30 minutes of physical activity daily to keep your heart healthy.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="tip-card shadow-lg p-4 rounded-4">
                <i className="bi bi-droplet-half text-primary fs-2 mb-3"></i>
                <h5>Hydration Matters</h5>
                <p>Drink 8 glasses of water daily to flush toxins and stay energized.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="tip-card shadow-lg p-4 rounded-4">
                <i className="bi bi-moon-stars-fill text-warning fs-2 mb-3"></i>
                <h5>Rest Well</h5>
                <p>7–8 hours of quality sleep rejuvenates your mind and body.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision py-5 bg-light text-center">
        <div className="container">
          <h2 className="text-brand mb-4">Our Mission & Vision</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card card-hover h-100 p-4 shadow">
                <h3>Our Mission</h3>
                <p>
                  To deliver affordable, high-quality healthcare solutions with
                  compassion, innovation, and trust.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card card-hover h-100 p-4 shadow">
                <h3>Our Vision</h3>
                <p>
                  To become the most reliable online pharmacy improving the
                  well-being of society and future generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find More Section */}
      <section className="find-more py-5 text-center">
        <div className="container">
          <h2 className="text-brand mb-4">Find Out More</h2>
          <div className="row g-4">
            <div className="col-md-3 col-sm-6">
              <div className="info-card shadow card-hover">
                <img src="/images/innovation.jpg" alt="Innovation" />
                <h5>Innovation</h5>
                <p>Embracing technology to redefine modern healthcare.</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="info-card shadow card-hover">
                <img src="/images/quality.jpg" alt="Quality" />
                <h5>Quality</h5>
                <p>Ensuring every product meets international standards.</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="info-card shadow card-hover">
                <img src="/images/careers.jpg" alt="Careers" />
                <h5>Careers</h5>
                <p>Join our growing team and make an impact in healthcare.</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="info-card shadow card-hover">
                <img src="/images/responsibility.jpg" alt="Responsibility" />
                <h5>Responsibility</h5>
                <p>We are committed to sustainable and ethical practices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Message for Society */}
      <section className="society-message text-center py-5">
        <div className="container">
          <h2 className="mb-3">Our Commitment to the Society</h2>
          <p className="lead px-4">
            Health is the foundation of happiness. At MediCure, we believe
            everyone deserves access to safe, effective, and affordable
            medicines. Together, we’re shaping a healthier tomorrow.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-center py-3">
        <p>© 2025 MediCure Pharmacy | All Rights Reserved.</p>
      </footer>
    </div>
  );
}
