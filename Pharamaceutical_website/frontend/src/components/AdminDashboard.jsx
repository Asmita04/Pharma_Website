// src/components/dashboard/AdminDashboard.jsx
import React, { useState,useEffect } from "react";
import "./admindashboard.css";
import MedicinesList from "./MedicinesList.jsx";
import MedicineForm from "./MedicineForm.jsx";
import DoctorsList from "./DoctorsList.jsx";
import DoctorForm from "./DoctorForm.jsx";
import { useNavigate, useLocation } from "react-router-dom";



export default function AdminDashboard() {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/"); // kick non-admins to home
    }
  }, [navigate]);

  //for route
  //const navigate = useNavigate();
  const location = useLocation();


  //Medicines
  const [medsView, setMedsView] = useState("list");        // 'list' | 'form'
  const [reloadTokenForMedicine, setReloadTokenForMedicine] = useState(0);        // force list reload
  const [selectedMedicine, setSelectedMedicine] = useState(null); // for edit

//Doctors
const [doctorsView, setDoctorsView] = useState("list");        // 'list' | 'form'
const [reloadTokenForDoctor, setReloadTokenForDoctor] = useState(0);  // force list reload
const [selectedDoctor, setSelectedDoctor] = useState(null);     // for edit

// ADD THIS new code right here
const [doctorCount, setDoctorCount] = useState(0);
const [medicineCount, setMedicineCount] = useState(0);
const API = import.meta.env.VITE_API_BASE_URL || "";



useEffect(() => {
  const loadDoctorCount = async () => {
    try {
      const res = await fetch(`${API}/api/doctors`);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const data = await res.json();
      const doctorsArray = Array.isArray(data.data) ? data.data : data;
      setDoctorCount(doctorsArray.length || 0);
    } catch (err) {
      console.error("Error fetching doctor count:", err);
    }
  };

  loadDoctorCount();
}, [API, reloadTokenForDoctor]);

useEffect(() => {
  const loadMedicineCount = async () => {
    try {
      const res = await fetch(`${API}/api/medicines`);
      if (!res.ok) throw new Error("Failed to fetch medicines");
      const data = await res.json();
      const MedicinesArray = Array.isArray(data.data) ? data.data : data;
      setMedicineCount(MedicinesArray.length || 0);
    } catch (err) {
      console.error("Error fetching medicine count:", err);
    }
  };

  loadMedicineCount();
}, [API, reloadTokenForMedicine]);


  const KPIS = [
    { key: "sales",    title: "Total Sales", suffix: "₹", value: 0, hint: "View total revenue" },
    { key: "orders",   title: "Orders",      value: 0,               hint: "View all orders" },
    { key: "doctors",  title: "Doctors",     value: doctorCount,     hint: "Manage doctors" },
    { key: "patients", title: "Patients",    value: 0,               hint: "Manage patients" },
    { key: "meds",     title: "Medicines",   value: medicineCount,   hint: "View/Add/Delete medicines" },
  ];

  const panelTitle = active
    ? ({ sales: "Total Sales", orders: "All Orders", doctors: "Doctors", patients: "Patients", meds: "Medicines" }[active])
    : "Select a card to view details";

  function renderPanel() {
    if (!active) {
      return <div className="text-muted">Select a card to view details.</div>;
    }

    if (active === "meds") {
      return medsView === "list" ? (
        <MedicinesList
          onAdd={() => { setSelectedMedicine(null); setMedsView("form"); }}
          onEdit={(row) => { setSelectedMedicine(row); setMedsView("form"); }}
          reloadTokenForMedicine={reloadTokenForMedicine}
        />
      ) : (
        <MedicineForm
          initial={selectedMedicine}               // if present -> PUT; else -> POST
          onSaved={() => { setMedsView("list"); setReloadTokenForMedicine(t => t + 1); }}
          onCancel={() => setMedsView("list")}
        />
      );
    }

    if (active === "doctors") {
      return doctorsView === "list" ? (
        <DoctorsList
          onAdd={() => { setSelectedDoctor(null); setDoctorsView("form"); }}
          onEdit={(row) => { setSelectedDoctor(row); setDoctorsView("form"); }}
          reloadTokenForDoctor={reloadTokenForDoctor}
        />
      ) : (
        <DoctorForm
          initial={selectedDoctor}               // if present -> PUT; else -> POST
          onSaved={() => { setDoctorsView("list"); setReloadTokenForDoctor(t => t + 1); }}
          onCancel={() => setDoctorsView("list")}
        />
      );
    }

    return <div className="text-muted"><em>Placeholder:</em> Content for <strong>{active}</strong> goes here.</div>;
  }

  return (
    <div className="container py-4 admin-dash">
      <h4 className="mb-1 fw-bold">Welcome back, Admin!</h4>
      <p className="text-muted mb-4">Manage your store, users and orders.</p>

      <div className="row g-3">
        {KPIS.map((kpi) => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-2-4" key={kpi.key}>
            <button
              type="button"
              className={`kpi-card w-100 text-start ${active === kpi.key ? "active" : ""}`}
             onClick={() => {
                      setActive(kpi.key);
                      if (kpi.key === "meds") setMedsView("list");
                      if (kpi.key === "doctors") setDoctorsView("list");
                      navigate(`/admin/dashboard/${kpi.key}`);
              }}

              title={kpi.hint}
            >
              <div className="kpi-icon" aria-hidden>
                {({ sales: "💰", orders: "📦", doctors: "🩺", patients: "👨‍⚕️", meds: "💊" }[kpi.key])}
              </div>
              <div className="kpi-title">{kpi.title}</div>
              <div className="kpi-value">{kpi.suffix === "₹" ? "₹" : ""}{kpi.value}</div>
            </button>
          </div>
        ))}
      </div>

      <div className="card shadow-sm border-0 mt-4 wide-panel">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-0">{panelTitle}</h5>
          </div>
          <hr className="my-3" />
          <div className="panel-body">{renderPanel()}</div>
        </div>
      </div>
    </div>
  );
}
