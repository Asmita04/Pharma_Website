import React, { useState } from "react";
import "./admin-doctors.css";

const SPECIALIZATION_OPTIONS = [
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

const MODE_OPTIONS = ["Hospital Visit", "Online Consult", "Both"];

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Marathi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Odia",
];

const INITIAL = {
  doctor_name: "",
  contact_no: "",
  address: "",
  specialization: "",
  modeOfConsult: "Both",
  experience: "",
  consultationFee: "",
  languages: ["English"],
};

export default function DoctorForm({
  onSaved, // () => void -> back to list + refresh
  onCancel, // () => void
  initial, // optional row for editing
}) {
  const API = import.meta.env.VITE_API_BASE_URL || "";
  const [form, setForm] = useState(
    initial ? { ...INITIAL, ...initial, languages: initial.languages || ["English"] } : INITIAL
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleLanguageToggle(lang) {
    setForm((f) => {
      const current = Array.isArray(f.languages) ? f.languages : ["English"];
      if (current.includes(lang)) {
        // Remove language (but keep at least one)
        const updated = current.filter((l) => l !== lang);
        return { ...f, languages: updated.length > 0 ? updated : ["English"] };
      } else {
        // Add language
        return { ...f, languages: [...current, lang] };
      }
    });
  }

  function validate() {
    if (!form.doctor_name?.trim()) return "Doctor name is required";
    if (!form.contact_no?.trim()) return "Contact number is required";
    if (form.contact_no.length < 8 || form.contact_no.length > 15)
      return "Contact number must be 8-15 characters";
    if (!form.address?.trim()) return "Address is required";
    if (!form.specialization) return "Specialization is required";
    if (!form.modeOfConsult) return "Mode of consult is required";

    const exp = Number(form.experience);
    if (isNaN(exp) || exp < 0 || exp > 60)
      return "Experience must be between 0 and 60 years";

    const fee = Number(form.consultationFee);
    if (isNaN(fee) || fee < 0) return "Consultation fee must be ≥ 0";

    if (!Array.isArray(form.languages) || form.languages.length === 0)
      return "At least one language is required";

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
      const url = initial
        ? `${API}/api/doctors/${initial.doctor_id}`
        : `${API}/api/doctors`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_name: form.doctor_name.trim(),
          contact_no: form.contact_no.trim(),
          address: form.address.trim(),
          specialization: form.specialization,
          modeOfConsult: form.modeOfConsult,
          experience: Number(form.experience),
          consultationFee: Number(form.consultationFee),
          languages: form.languages,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed: ${res.status}`);
      }

      setMsg({
        type: "success",
        text: `Doctor ${initial ? "updated" : "added"} successfully ✅`,
      });
      setForm(INITIAL);
      setTimeout(() => onSaved?.(), 1000);
    } catch (error) {
      setMsg({ type: "danger", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-doctors">
      <div className="d-flex align-items-center justify-content-between kbar mb-3">
        <h6 className="mb-0 fw-bold text-brand">
          {initial ? "Edit Doctor" : "Add Doctor"}
        </h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-brand btn-sm"
            onClick={() => setForm(INITIAL)}
            disabled={loading}
          >
            Reset
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onCancel}
            disabled={loading}
          >
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
                <label className="form-label">Doctor Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="doctor_name"
                  value={form.doctor_name}
                  onChange={handleChange}
                  placeholder="Enter doctor's full name"
                  required
                />

                <label className="form-label mt-3">Contact Number *</label>
                <input
                  type="text"
                  className="form-control"
                  name="contact_no"
                  value={form.contact_no}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                />

                <label className="form-label mt-3">Address *</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Clinic/Hospital address with city"
                  required
                />

                <label className="form-label mt-3">Specialization *</label>
                <select
                  className="form-select"
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATION_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Right column */}
              <div className="col-md-6">
                <label className="form-label">Mode of Consult *</label>
                <select
                  className="form-select"
                  name="modeOfConsult"
                  value={form.modeOfConsult}
                  onChange={handleChange}
                  required
                >
                  {MODE_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                <div className="row g-3 mt-0">
                  <div className="col-md-6">
                    <label className="form-label">Experience (years) *</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      className="form-control"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Consultation Fee (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form-control"
                      name="consultationFee"
                      value={form.consultationFee}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <label className="form-label mt-3">Languages Spoken *</label>
                <div className="border rounded p-3" style={{ maxHeight: 200, overflowY: "auto" }}>
                  <div className="row g-2">
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <div key={lang} className="col-6 col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`lang-${lang}`}
                            checked={
                              Array.isArray(form.languages) && form.languages.includes(lang)
                            }
                            onChange={() => handleLanguageToggle(lang)}
                          />
                          <label className="form-check-label" htmlFor={`lang-${lang}`}>
                            {lang}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-text mt-1">
                  Selected:{" "}
                  {Array.isArray(form.languages) && form.languages.length > 0
                    ? form.languages.join(", ")
                    : "None"}
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-brand" type="submit" disabled={loading}>
                {loading ? "Saving…" : initial ? "Save Changes" : "Save Doctor"}
              </button>
              <button
                className="btn btn-outline-brand"
                type="button"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}