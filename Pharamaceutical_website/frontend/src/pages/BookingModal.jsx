import React, { useState } from "react";
import "./BookingModal.css";

const INITIAL_FORM = {
  patient_name: "",
  patient_email: "",
  patient_phone: "",
  appointment_date: "",
  appointment_time: "",
  symptoms: "",
};

export default function BookingModal({ doctor, consultationType, onClose }) {
  const API = import.meta.env.VITE_API_BASE_URL || "";
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    if (!form.patient_name?.trim()) return "Patient name is required";
    if (!form.patient_email?.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.patient_email))
      return "Valid email is required";
    if (!form.patient_phone?.trim()) return "Phone number is required";
    if (form.patient_phone.length < 8 || form.patient_phone.length > 15)
      return "Phone number must be 8-15 characters";
    if (!form.appointment_date) return "Appointment date is required";
    
    // Check if date is in the future
    const selectedDate = new Date(form.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return "Appointment date must be in the future";
    
    if (!form.appointment_time) return "Appointment time is required";

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const err = validate();
    if (err) return setMsg({ type: "danger", text: err });

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_id: doctor.doctor_id,
          patient_name: form.patient_name.trim(),
          patient_email: form.patient_email.trim(),
          patient_phone: form.patient_phone.trim(),
          appointment_date: form.appointment_date,
          appointment_time: form.appointment_time,
          consultation_type: consultationType,
          symptoms: form.symptoms?.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Request failed: ${res.status}`);
      }

      setMsg({
        type: "success",
        text: "Booking successful! You will receive a confirmation email shortly. ✅",
      });
      setForm(INITIAL_FORM);

      // Close modal after 2 seconds
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      setMsg({ type: "danger", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">Book Appointment</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={loading}
          ></button>
        </div>

        <div className="modal-body">
          {/* Doctor Info */}
          <div className="doctor-info-card mb-3">
            <div className="d-flex gap-3">
              <div>
                <h6 className="mb-1">{doctor.doctor_name}</h6>
                <p className="text-muted small mb-1">{doctor.specialization}</p>
                <p className="text-muted small mb-1">{doctor.address}</p>
                <p className="fw-bold text-brand mb-0">
                  ₹{parseFloat(doctor.consultationFee).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <span
                className={`badge ${
                  consultationType === "Online Consult"
                    ? "bg-primary"
                    : "bg-success"
                }`}
              >
                {consultationType}
              </span>
            </div>
          </div>

          {msg.text && (
            <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Patient Name *</label>
              <input
                type="text"
                className="form-control"
                name="patient_name"
                value={form.patient_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="patient_email"
                  value={form.patient_email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="patient_phone"
                  value={form.patient_phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Appointment Date *</label>
                <input
                  type="date"
                  className="form-control"
                  name="appointment_date"
                  value={form.appointment_date}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Appointment Time *</label>
                <input
                  type="time"
                  className="form-control"
                  name="appointment_time"
                  value={form.appointment_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Symptoms / Reason for Visit</label>
              <textarea
                className="form-control"
                name="symptoms"
                value={form.symptoms}
                onChange={handleChange}
                rows="3"
                placeholder="Describe your symptoms (optional)"
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-brand flex-fill"
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary flex-fill"
                onClick={onClose}
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