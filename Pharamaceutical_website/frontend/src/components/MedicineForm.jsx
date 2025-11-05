// src/components/dashboard/medicines/MedicineForm.jsx
import React, { useState } from "react";
import "./admin-medicines.css";

const CATEGORY_OPTIONS = [
  "Diabetic Care",
  "Stomach Care",
  "Liver Care",
  "Cold & Immunity",
  "Pain Relief",
  "Personal Care",
];

const INITIAL = {
  name: "",
  category: "",
  price: "",
  rating: "",
  pack: "",
  expiry_date: "",
  status: "available",
  desc: "",
  img: "",
};

export default function MedicineForm({
  onSaved,     // () => void  -> back to list + refresh
  onCancel,    // () => void
  initial,     // optional row for editing (not required now)
}) {
  const API = import.meta.env.VITE_API_BASE_URL || "";
  const [form, setForm] = useState(initial ? { ...INITIAL, ...initial } : INITIAL);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    if (!form.name?.trim()) return "Name is required";
    if (!form.category) return "Category is required";
    if (form.price === "" || Number(form.price) < 0) return "Price must be ≥ 0";
    const rating = Number(form.rating);
    if (isNaN(rating) || rating < 0 || rating > 5) return "Rating must be between 0 and 5";
    if (form.expiry_date) {
      const today = new Date().toISOString().slice(0, 10);
      if (form.expiry_date < today) return "Expiry date cannot be in the past";
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const err = validate();
    if (err) return setMsg({ type: "danger", text: err });

    try {
      setLoading(true);
      const method = initial ? "PUT" : "POST";
      const url = initial ? `${API}/api/medicines/${initial.id}` : `${API}/api/medicines`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          category: form.category,
          price: Number(form.price),
          rating: Number(form.rating),
          pack: form.pack?.trim() || null,
          expiry_date: form.expiry_date || null,
          status: form.status || "available",
          desc: form.desc?.trim() || null,
          img: form.img?.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed: ${res.status}`);
      }

      setMsg({ type: "success", text: `Medicine ${initial ? "updated" : "added"} successfully ✅` });
      setForm(INITIAL);
      onSaved?.();
    } catch (error) {
      setMsg({ type: "danger", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-meds">
      <div className="d-flex align-items-center justify-content-between kbar mb-3">
        <h6 className="mb-0 fw-bold text-brand">{initial ? "Edit Medicine" : "Add Medicine"}</h6>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-brand btn-sm" onClick={() => setForm(INITIAL)} disabled={loading}>
            Reset
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onCancel} disabled={loading}>
            Back to List
          </button>
        </div>
      </div>

      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              {/* Left column */}
              <div className="col-md-6">
                <label className="form-label">Medicine Image (path)</label>
                <input
                  type="text"
                  className="form-control"
                  name="img"
                  value={form.img}
                  onChange={handleChange}
                  placeholder="/images/panadol.jpg"
                />
                <div className="form-text">
                  Put images in <code>/public/images</code> and refer as <code>/images/…</code>
                </div>

                <label className="form-label mt-3">Quantity/Pack</label>
                <input
                  type="text"
                  className="form-control"
                  name="pack"
                  value={form.pack}
                  onChange={handleChange}
                  placeholder="Strip of 10 / 200 ml bottle"
                />

                <label className="form-label mt-3">MRP / Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Short description (optional)"
                />
              </div>

              {/* Right column */}
              <div className="col-md-6">
                <label className="form-label">Medicine Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <div className="row g-3 mt-0">
                  <div className="col-md-6">
                    <label className="form-label">Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Rating (0–5) *</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      className="form-control"
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row g-3 mt-0">
                  <div className="col-md-6">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="expiry_date"
                      value={form.expiry_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row g-3 mt-0">
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="available">Available</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-brand" type="submit" disabled={loading}>
                {loading ? "Saving…" : (initial ? "Save Changes" : "Save Medicine")}
              </button>
              <button className="btn btn-outline-brand" type="button" onClick={onCancel} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
