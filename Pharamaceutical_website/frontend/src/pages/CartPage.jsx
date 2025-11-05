// src/pages/CartPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import "./medicine-shop.css"; // ← NEW file you will create (styles below)

export default function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(saved);
  }, []);

  const totals = useMemo(() => {
    const cartTotal = items.reduce((sum, it) => sum + Number(it.price) * (it.quantity || 1), 0);
    const delivery = 0;
    return { cartTotal, delivery, toPay: cartTotal + delivery };
  }, [items]);

  const updateQty = (id, qty) => {
    const newList = items.map((it) => (it.id === id ? { ...it, quantity: Number(qty) } : it));
    setItems(newList);
    localStorage.setItem("cart", JSON.stringify(newList));
  };

  const removeItem = (id) => {
    const newList = items.filter((it) => it.id !== id);
    setItems(newList);
    localStorage.setItem("cart", JSON.stringify(newList));
  };

  return (
    <div className="container-xxl cart-page my-4">
      <h6 className="text-center mb-4 fw-bold text-brand">
        {items.length} ITEM{items.length !== 1 ? "S" : ""} IN YOUR CART
      </h6>

      <div className="row g-4 align-items-start">
        
        {/* LEFT SIDE – product list */}
        <div className="col-12 col-lg-8 col-xl-9">
          <div className="card shadow-sm border-0 rounded-3 w-100 p-4">
            {items.map((it) => (
              <div key={it.id} className="d-flex align-items-center gap-4 mb-4">
                <img src={it.img} alt={it.name} width={80} />

                <div className="flex-grow-1">
                  <div className="fw-semibold mb-1">{it.name}</div>
                  <div className="fw-bold">₹{it.price}</div>
                </div>

                <select
                  className="form-select w-auto"
                  value={it.quantity}
                  onChange={(e) => updateQty(it.id, e.target.value)}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>

                <button className="btn btn-link text-danger fs-5" onClick={() => removeItem(it.id)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE – breakdown + payments + pay */}
        <div className="col-12 col-lg-4 col-xl-3">

          {/* BREAKDOWN */}
          <div className="card shadow-sm border-0 rounded-3 mb-3 w-100 p-4">
            <h6 className="fw-bold text-center mb-3">CART BREAKDOWN</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Cart Total</span><span className="fw-semibold">₹{totals.cartTotal}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Delivery Charges</span><span className="fw-semibold">₹{totals.delivery}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>To Pay</span><span className="text-brand">₹{totals.toPay}</span>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="card shadow-sm border-0 rounded-3 mb-3 w-100 p-4">
            <h6 className="fw-bold text-center mb-3">PAYMENT METHODS</h6>

            <div className="form-check mb-2">
              <input className="form-check-input" type="radio" name="payment" defaultChecked />
              <label className="form-check-label fw-semibold">Pay by any UPI</label>
              <div className="small text-muted">GPay, PhonePe, Paytm, BHIM</div>
              <input className="form-control form-control-sm mt-1" placeholder="Enter UPI ID" />
            </div>

            <div className="form-check mb-2">
              <input className="form-check-input" type="radio" name="payment" />
              <label className="form-check-label fw-semibold">Credit/Debit Card</label>
            </div>

            <div className="form-check mb-2">
              <input className="form-check-input" type="radio" name="payment" />
              <label className="form-check-label fw-semibold">Net Banking</label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="radio" name="payment" />
              <label className="form-check-label fw-semibold">Cash on Delivery</label>
            </div>
          </div>

          {/* PAY AMOUNT */}
          <div className="card shadow-sm border-0 rounded-3 w-100 p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-muted">Amount to pay</div>
                <div className="fw-bold fs-4">₹{totals.toPay}</div>
              </div>
              <button className="btn btn-brand px-4">Proceed</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
