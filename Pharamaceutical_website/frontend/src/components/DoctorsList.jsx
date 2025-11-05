import React, { useEffect, useMemo, useState } from "react";
import "./admin-doctors.css";

const SPECIALIZATIONS = [
  "Urologist",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic",
  "Gynecologist",
  "Neurologist",
  "Dentist",
  "General Physician",
  "Psychiatrist",
  "Ophthalmologist",
  "ENT Specialist",
];

const MODES = ["Hospital Visit", "Online Consult", "Both"];

export default function DoctorsList({ onAdd, onEdit, reloadToken = 0 }) {
  const API = import.meta.env.VITE_API_BASE_URL || "";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [mode, setMode] = useState("");

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/doctors`);
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        const data = await res.json();
        if (!ignore) {
          setRows(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!ignore) setMsg(e.message || "Failed to load doctors");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [API, reloadToken]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (specialization && r.specialization !== specialization) return false;
      if (mode && r.modeOfConsult !== mode) return false;
      if (!term) return true;
      return (
        r.doctor_name?.toLowerCase().includes(term) ||
        r.specialization?.toLowerCase().includes(term) ||
        r.address?.toLowerCase().includes(term) ||
        r.contact_no?.includes(term)
      );
    });
  }, [rows, q, specialization, mode]);

  async function handleDelete(id, name) {
    if (!confirm(`Delete Dr. ${name}?`)) return;
    try {
      const res = await fetch(`${API}/api/doctors/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Delete failed (${res.status})`);
      }
      // Optimistic remove from table
      setRows((prev) => prev.filter((r) => r.doctor_id !== id));
    } catch (e) {
      alert(e.message || "Delete failed");
    }
  }

  return (
    <div className="admin-doctors">
      <div className="d-flex align-items-center justify-content-between kbar mb-3">
        <h6 className="mb-0 fw-bold text-brand">Doctors</h6>
        <div className="d-flex gap-2">
          <input
            className="form-control form-control-sm"
            placeholder="Search doctors…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="form-select form-select-sm"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="">All Specializations</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            className="form-select form-select-sm"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="">All Modes</option>
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button className="btn btn-brand btn-sm" onClick={onAdd}>
            + Add Doctor
          </button>
        </div>
      </div>

      {msg && <div className="alert alert-danger py-2">{msg}</div>}

      <div className="table-responsive">
        <table className="table table-hover align-middle table-doctors">
          <thead>
            <tr>
              <th style={{ width: 56 }}>#</th>
              <th>Doctor Name</th>
              <th>Contact</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Fee (₹)</th>
              <th>Languages</th>
              <th>Mode</th>
              <th>Address</th>
              <th style={{ width: 120 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4 text-muted">
                  No doctors found.
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r.doctor_id}>
                  <td>{i + 1}</td>
                  <td>
                    <div className="fw-semibold">Dr. {r.doctor_name}</div>
                  </td>
                  <td>{r.contact_no}</td>
                  <td>
                    <span className="badge bg-info-subtle text-info">
                      {r.specialization}
                    </span>
                  </td>
                  <td>{r.experience} years</td>
                  <td>₹{Number(r.consultationFee).toFixed(2)}</td>
                  <td>
                    <div className="small">
                      {Array.isArray(r.languages)
                        ? r.languages.slice(0, 2).join(", ")
                        : "English"}
                      {Array.isArray(r.languages) && r.languages.length > 2 && (
                        <span className="text-muted"> +{r.languages.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        r.modeOfConsult === "Both"
                          ? "bg-success-subtle text-success"
                          : r.modeOfConsult === "Online Consult"
                          ? "bg-primary-subtle text-primary"
                          : "bg-warning-subtle text-warning"
                      }`}
                    >
                      {r.modeOfConsult}
                    </span>
                  </td>
                  <td>
                    <div className="small text-muted">
                      {r.address?.slice(0, 30)}
                      {r.address?.length > 30 && "..."}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-brand"
                        title="Edit"
                        onClick={() => onEdit?.(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        title="Delete"
                        onClick={() => handleDelete(r.doctor_id, r.doctor_name)}
                      >
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