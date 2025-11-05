// src/components/dashboard/AdminDashboard.jsx
import React, { useState } from "react";
import "./admindashboard.css";
import MedicinesList from "./MedicinesList.jsx";
import MedicineForm from "./MedicineForm.jsx";

export default function AdminDashboard() {
  const [active, setActive] = useState(null);
  const [medsView, setMedsView] = useState("list");        // 'list' | 'form'
  const [reloadToken, setReloadToken] = useState(0);        // force list reload
  const [selectedMedicine, setSelectedMedicine] = useState(null); // for edit

  const KPIS = [
    { key: "sales",    title: "Total Sales", suffix: "₹", value: 0, hint: "View total revenue" },
    { key: "orders",   title: "Orders",      value: 0,               hint: "View all orders" },
    { key: "doctors",  title: "Doctors",     value: 0,               hint: "Manage doctors" },
    { key: "patients", title: "Patients",    value: 0,               hint: "Manage patients" },
    { key: "meds",     title: "Medicines",   value: 0,               hint: "View/Add/Delete medicines" },
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
          reloadToken={reloadToken}
        />
      ) : (
        <MedicineForm
          initial={selectedMedicine}               // if present -> PUT; else -> POST
          onSaved={() => { setMedsView("list"); setReloadToken(t => t + 1); }}
          onCancel={() => setMedsView("list")}
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
              onClick={() => { setActive(kpi.key); if (kpi.key === "meds") setMedsView("list"); }}
              title={kpi.hint}
            >
              <div className="kpi-icon" aria-hidden>★</div>
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
