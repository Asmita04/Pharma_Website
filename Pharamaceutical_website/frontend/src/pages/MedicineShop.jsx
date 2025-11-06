// src/pages/MedicineShop.jsx
import React, { useEffect, useState, useMemo, } from "react";
import { useNavigate } from "react-router-dom";
import "./medicine-shop.css";

const API = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

// turn DB value into a full URL the browser can load
const toImgUrl = (val) =>
  !val
    ? ""
    : /^https?:\/\//i.test(val)         // already absolute (CDN/remote)
    ? val
    : `${API}${val.startsWith("/") ? val : "/" + val}`; // make absolute

const CATEGORIES = [
  "All",
  "Diabetic Care",
  "Stomach Care",
  "Liver Care",
  "Cold & Immunity",
  "Pain Relief",
  "Personal Care",
];

const CART_KEY = "cart";

const getCart = () => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
};

const setCart = (arr) => localStorage.setItem(CART_KEY, JSON.stringify(arr));

const addOrIncrement = (product, qty = 1) => {
  const cart = getCart();
  const idx = cart.findIndex((c) => String(c.id) === String(product.id));
  if (idx >= 0) {
    cart[idx].quantity = Number(cart[idx].quantity || 1) + Number(qty || 1);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      img: toImgUrl(product.img), // store fully-qualified image URL
      quantity: Number(qty || 1),
    });
  }
  setCart(cart);
};

function StarRating({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="text-warning">
      {"★".repeat(full)}
      {half ? "☆" : ""}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function MedicineShop() {
  const [activeCat, setActiveCat] = useState("All");
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate();

  // fetch data from backend
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/medicines`);
      const data = await res.json();
      setMedicines(data);
    };
    load();
  }, []);

  const items = useMemo(() => {
    if (activeCat === "All") return medicines;
    return medicines.filter((p) => p.category === activeCat);
  }, [activeCat, medicines]);

  return (
  <div className="medicine-shop">
    {/* Hero */}
    <section className="shop-hero-wrap">
      <div className="container">
        <div className="shop-hero-card">
          <div className="shop-hero-overlay" />
          <div className="shop-hero-content">
            <div className="container">
              <h1 className="display-5 fw-bold text-white">
                Shop Medicines & Healthcare
              </h1>
              <p className="lead text-white-50 mb-0">
                Discover curated essentials across diabetic care, immunity, pain relief and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Filter Bar */}
    <section className="container py-4">
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`btn btn-filter ${activeCat === cat ? "active" : ""}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </section>

    {/* Product Grid */}
      <section className="container pb-5">
        <div className="products-grid">
          {items.map((p) => {
            const imgSrc = toImgUrl(p.img);
            return (
              <article key={p.id} className="card product-card h-100 shadow-sm border-0">
                <span className="badge badge-cat">{p.category}</span>

                <div className="img-wrap">
                  <img
                    src={imgSrc}
                    alt={p.name}
                    className="card-img-top"
                    onError={(e) => { e.currentTarget.src = "/images/placeholder.png"; }}
                  />
                  <div className="hover-drop">
                    <h6 className="mb-1">{p.name}</h6>
                    <p className="mb-0">{p.desc?.slice(0, 70)}...</p>
                    <span className="price">₹{p.price}</span>
                  </div>
                </div>

                <div className="card-body">
                  <h5 className="card-title mb-1">{p.name}</h5>
                  {/* rating, pack, expiry … */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <StarRating value={p.rating} />
                  <span className="small text-muted">{Number(p.rating).toFixed(1)}</span>
                </div>
                <p className="card-text text-muted small mb-3">{p.pack}</p>

                {/* expiry date */}
                {p.expiry_date && (
                <p className="card-text text-muted small mb-3">
                Exp: {new Date(p.expiry_date).toLocaleDateString()}
                </p>
                )}

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <span>OTC</span>
                    <span className="dot" />
                    <span>{p.category}</span>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold text-brand">₹{p.price}</div>
                    <small className="text-muted">/ pack</small>
                  </div>
                </div>
                </div>

                <div className="card-footer bg-white border-0 pt-0 pb-4 px-4">
                  <div className="d-flex justify-content-between gap-2">
                    <button className="btn btn-outline-brand flex-fill"onClick={() => {addOrIncrement(p, 1);}}>Add to Cart</button>
                    <button
                      className="btn btn-brand flex-fill"
                      onClick={() => {
                        addOrIncrement(p, 1); // add (or increment) first
                        navigate("/cart");    // then go to cart
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
