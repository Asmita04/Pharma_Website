import React, { useState } from "react";
import DoctorsList from "./DoctorsList";
import DoctorForm from "./DoctorForm";

export default function DoctorsManagement() {
  const [view, setView] = useState("list"); // 'list' or 'form'
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  function handleAdd() {
    setEditingDoctor(null);
    setView("form");
  }

  function handleEdit(doctor) {
    setEditingDoctor(doctor);
    setView("form");
  }

  function handleSaved() {
    setReloadToken((t) => t + 1); // Trigger reload
    setView("list");
    setEditingDoctor(null);
  }

  function handleCancel() {
    setView("list");
    setEditingDoctor(null);
  }

  return (
    <div className="doctors-management">
      {view === "list" ? (
        <DoctorsList
          onAdd={handleAdd}
          onEdit={handleEdit}
          reloadToken={reloadToken}
        />
      ) : (
        <DoctorForm
          initial={editingDoctor}
          onSaved={handleSaved}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}