import React, { useMemo, useState, useEffect } from "react";
import "./medicine-shop.css";

export default function CartPage() {
  const [items, setItems] = useState([]);

  // ✅ load only the item saved from Buy Now
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart"));
    if (saved) setItems(saved);
  }, []);

  const totals = useMemo(() => {
    const cartTotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const delivery = 0;
    const toPay = cartTotal + delivery;
    return { cartTotal, delivery, toPay };
  }, [items]);

  const updateQty = (id, qty) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Number(qty) } : it))
    );
  };

  const removeItem = (id) => {
    const newItems = items.filter((it) => it.id !== id);
    setItems(newItems);
    localStorage.setItem("cart", JSON.stringify(newItems)); // update storage too
  };

  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* Left: Items */}
        <div className="col-lg-8">
          <h6 className="text-uppercase text-muted fw-bold mb-3">
            {items.length} Item{items.length !== 1 ? "s" : ""} in your cart
          </h6>

          {items.map((it) => (
            <div key={it.id} className="card shadow-sm border-0 mb-3 rounded-3">
              <div className="card-body">
                <div className="d-flex align-items-start gap-3">
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

                  <div className="flex-grow-1">
                    <h6 className="mb-1">{it.name}</h6>
                    <div className="text-muted small mb-2">{it.pack}</div>

                    <div className="d-flex align-items-center gap-3">
                      <div>
                        <div className="fw-bold">₹{it.price}</div>
                      </div>

                      <div className="ms-auto">
                        <div className="input-group input-group-sm" style={{ width: 120 }}>
                          <span className="input-group-text bg-white">Qty</span>
                          <select
                            className="form-select"
                            value={it.qty}
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
                  </div>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="alert alert-info">Your cart is empty.</div>
          )}
        </div>

        {/* Right: Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-3">
            <div className="card-body">
              <h6 className="text-uppercase fw-bold mb-3">Cart Breakdown</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Cart Total</span>
                <span className="fw-semibold">₹{totals.cartTotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Charges</span>
                <span className="fw-semibold">₹{totals.delivery}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <div className="small text-muted">To Pay</div>
                <div className="fs-5 fw-bold text-brand">₹{totals.toPay}</div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <div className="small text-muted">Amount to pay</div>
                <div className="fs-4 fw-bold">₹{totals.toPay}</div>
              </div>
              <button
                className="btn btn-brand px-4"
                onClick={() => alert("Proceed to payment")}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
