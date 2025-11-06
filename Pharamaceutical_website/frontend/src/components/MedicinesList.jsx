// src/components/dashboard/medicines/MedicinesList.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./admin-medicines.css";

const CATS = ["Diabetic Care","Stomach Care","Liver Care","Cold & Immunity","Pain Relief","Personal Care"];

export default function MedicinesList({ onAdd, onEdit, reloadToken = 0 }) {
  const API = import.meta.env.VITE_API_BASE_URL || "";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState("");

  // --- NEW: image resolver ---
  const resolveImg = (p) => {
    if (!p) return "";
    // absolute or data/blob URLs -> use as-is
    if (/^(https?:)?\/\//i.test(p) || /^data:|^blob:/i.test(p)) return p;

    // frontend static assets (served by Vite) -> use as-is
    if (p.startsWith("/images")) return p;

    // backend uploads -> prefix API base
    if (p.startsWith("/uploads")) return `${API}${p}`;

    // anything else: make it a backend-relative path
    return `${API}${p.startsWith("/") ? "" : "/"}${p}`;
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/medicines`);
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        const data = await res.json();
        if (!ignore) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!ignore) setMsg(e.message || "Failed to load medicines");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [API, reloadToken]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter(r => {
      if (cat && r.category !== cat) return false;
      if (status && r.status !== status) return false;
      if (!term) return true;
      return (
        r.name?.toLowerCase().includes(term) ||
        r.category?.toLowerCase().includes(term) ||
        r.desc?.toLowerCase?.().includes(term)
      );
    });
  }, [rows, q, cat, status]);

  async function handleDelete(id) {
    if (!confirm("Delete this medicine?")) return;
    try {
      const res = await fetch(`${API}/api/medicines/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Delete failed (${res.status})`);
      }
      setRows(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  return (
    <div className="admin-meds">
      <div className="d-flex align-items-center justify-content-between kbar mb-3">
        <h6 className="mb-0 fw-bold text-brand">Medicines</h6>
        <div className="d-flex gap-2">
          <input
            className="form-control form-control-sm"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="form-select form-select-sm" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All Categories</option>
            {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn btn-brand btn-sm" onClick={onAdd}>+ Add Medicine</button>
        </div>
      </div>

      {msg && <div className="alert alert-danger py-2">{msg}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle table-meds">
          <thead>
            <tr>
              <th style={{ width: 56 }}>#</th>
              <th>Photo</th>
              <th>Medicine Name</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Pack</th>
              <th>Expiry</th>
              <th>Category</th>
              <th>Status</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="text-center py-4">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-4 text-muted">No records.</td></tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td>
                    <div className="thumb">
                      {r.img ? (
                        <img
                          src={resolveImg(r.img)}
                          alt={r.name}
                          width={36}
                          height={36}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = "public/images/glycol.webp"; }}
                        />
                      ) : (
                        <span className="thumb-ph">No Image</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold">{r.name}</div>
                    {r.desc && <div className="text-muted small">{r.desc.slice(0, 50)}…</div>}
                  </td>
                  <td>₹{Number(r.price).toFixed(2)}</td>
                  <td>{Number(r.rating || 0).toFixed(1)}</td>
                  <td>{r.pack || "-"}</td>
                  <td>{r.expiry_date ? new Date(r.expiry_date).toLocaleDateString() : "-"}</td>
                  <td>{r.category}</td>
                  <td>
                    <span className={`badge ${r.status === "available" ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-brand" title="Edit" onClick={() => onEdit?.(r)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" title="Delete" onClick={() => handleDelete(r.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
