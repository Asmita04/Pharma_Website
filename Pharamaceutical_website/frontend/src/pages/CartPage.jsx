// src/pages/CartPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./medicine-shop.css"; // keep using your existing stylesheet

export default function CartPage() {
  const [items, setItems] = useState([]);

  // Load from localStorage once
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    // default quantity = 1
    setItems(saved.map(it => ({ ...it, quantity: Number(it.quantity || 1) })));
  }, []);

  // Totals
  const totals = useMemo(() => {
    const cartTotal = items.reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1),
      0
    );
    const delivery = 0;
    return { cartTotal, delivery, toPay: cartTotal + delivery };
  }, [items]);

  // Helpers
  const persist = (next) => localStorage.setItem("cart", JSON.stringify(next));

  const updateQty = (id, qty) => {
    const next = items.map((it) =>
      it.id === id ? { ...it, quantity: Number(qty) } : it
    );
    setItems(next);
    persist(next);
  };

  const removeItem = (id) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    persist(next);
  };

    // inside CartPage component
  const proceed = () => {
    // do your payment/checkout here…
    // when finished, clear cart:
    localStorage.removeItem("cart");
    setItems([]);
    alert("Order placed successfully!");
    // optionally: navigate("/thank-you");
  };

  // Small currency helper
  const formatprice = (n) => Number(n || 0).toFixed(2);

  return (
    <div className="container-xxl cart-page py-4">
      <div className="row g-4 align-items-start">

        {/* LEFT: Scrollable box with line items */}
        <div className="col-12 col-lg-8 col-xl-9">
          <div className="card shadow-sm border-0 rounded-3 w-100">
            {/* Header inside the box */}
            <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
              <h6 className="m-0 fw-bold text-brand">Cart Items</h6>
              <span className="badge rounded-pill bg-light text-dark">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Scrollable list area */}
            <div
              className="px-3 py-3"
              style={{
                maxHeight: 440,         // height of the box before it scrolls
                overflowY: "auto",
              }}
            >
              {items.length === 0 ? (
                <div className="text-muted py-4 text-center">
                  Your cart is empty.
                </div>
              ) : (
                items.map((it, idx) => (
                  <div
                    key={`${it.id}-${idx}`}
                    className="d-flex align-items-center gap-3 py-3"
                    style={{ borderBottom: idx === items.length - 1 ? "none" : "1px solid #eef3f0" }}
                  >
                    {/* Image */}
                    <div
                      className="flex-shrink-0 rounded"
                      style={{ width: 82, height: 82, overflow: "hidden" }}
                    >
                      <img
                        src={it.img}
                        alt={it.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>

                    {/* Title + price */}
                    <div className="flex-grow-1">
                      <div className="fw-semibold mb-1">{it.name}</div>
                      <div className="fw-bold">₹{formatprice(it.price)}</div>
                    </div>

                    {/* Qty selector */}
                    <div className="ms-auto">
                      <div className="input-group input-group-sm" style={{ width: 120 }}>
                        <span className="input-group-text bg-white">Qty</span>
                        <select
                          className="form-select"
                          value={it.quantity}
                          onChange={(e) => updateQty(it.id, e.target.value)}
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      className="btn btn-link text-danger ms-2"
                      onClick={() => removeItem(it.id)}
                      title="Remove item"
                      aria-label="Remove item"
                      style={{ textDecoration: "none" }}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Breakdown + Payment Methods + Pay box */}
        <div className="col-12 col-lg-4 col-xl-3">
          {/* Breakdown */}
          <div className="card shadow-sm border-0 rounded-3 mb-3 w-100 p-4">
            <h6 className="fw-bold text-center mb-3">CART BREAKDOWN</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Cart Total</span>
              <span className="fw-semibold">₹{formatprice(totals.cartTotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Delivery Charges</span>
              <span className="fw-semibold">₹{formatprice(totals.delivery)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>To Pay</span>
              <span className="text-brand">₹{formatprice(totals.toPay)}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="card shadow-sm border-0 rounded-3 mb-3 w-100 p-4">
            <h6 className="fw-bold text-center mb-3">PAYMENT METHODS</h6>

            <div className="form-check mb-3">
              <input className="form-check-input" type="radio" name="payment" id="payUPI" defaultChecked />
              <label className="form-check-label fw-semibold" htmlFor="payUPI">
                Pay by any UPI
              </label>
              <div className="small text-muted">GPay, PhonePe, Paytm, BHIM</div>
              <input className="form-control form-control-sm mt-2" placeholder="Enter UPI ID" />
            </div>

            <div className="form-check mb-2">
              <input className="form-check-input" type="radio" name="payment" id="payCard" />
              <label className="form-check-label fw-semibold" htmlFor="payCard">
                Credit/Debit Card
              </label>
            </div>

            <div className="form-check mb-2">
              <input className="form-check-input" type="radio" name="payment" id="payNet" />
              <label className="form-check-label fw-semibold" htmlFor="payNet">
                Net Banking
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="radio" name="payment" id="payCOD" />
              <label className="form-check-label fw-semibold" htmlFor="payCOD">
                Cash on Delivery
              </label>
            </div>
          </div>

          {/* Amount to pay */}
          <div className="card shadow-sm border-0 rounded-3 w-100 p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-muted">Amount to pay</div>
                <div className="fw-bold fs-4">₹{formatprice(totals.toPay)}</div>
              </div>
              <button className="btn btn-brand px-4" onClick={proceed}>Proceed</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
