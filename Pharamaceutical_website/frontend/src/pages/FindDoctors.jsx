import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Find-doctors.css";

const SPECIALIZATIONS = [
  "All",
  "Urologist",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic",
  "Gynecologist",
  "Neurologist",
  "Dentist",
  "General Physician",
];

function StarRating({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="text-warning">
      {"★".repeat(full)}
      {half ? "☆" : ""}
      {"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({
    specialization: "All",
    modeOfConsult: [],
    experienceRange: [],
    feeRange: [],
    languages: [],
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false); // ✅ added this missing state
  const navigate = useNavigate();

  // Fetch doctors from backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/doctors`);
        const data = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error loading doctors:", error);
      }
    };
    load();
  }, []);

  // Filter doctors based on selected filters
  const filteredDoctors = useMemo(() => {
    let result = doctors;

    if (filters.specialization !== "All") {
      result = result.filter((d) => d.specialization === filters.specialization);
    }

    if (filters.modeOfConsult.length > 0) {
      result = result.filter(
        (d) => filters.modeOfConsult.includes(d.modeOfConsult) || d.modeOfConsult === "Both"
      );
    }

    if (filters.experienceRange.length > 0) {
      result = result.filter((d) =>
        filters.experienceRange.some((range) => {
          if (range === "0-5") return d.experience <= 5;
          if (range === "6-10") return d.experience >= 6 && d.experience <= 10;
          if (range === "11-16") return d.experience >= 11 && d.experience <= 16;
          if (range === "17+") return d.experience >= 17;
          return true;
        })
      );
    }

    if (filters.feeRange.length > 0) {
      result = result.filter((d) =>
        filters.feeRange.some((range) => {
          const fee = parseFloat(d.consultationFee);
          if (range === "100-500") return fee >= 100 && fee <= 500;
          if (range === "500-1000") return fee >= 500 && fee <= 1000;
          if (range === "1000+") return fee >= 1000;
          return true;
        })
      );
    }

    if (filters.languages.length > 0) {
      result = result.filter((d) => {
        const docLangs = Array.isArray(d.languages) ? d.languages : [];
        return filters.languages.some((lang) => docLangs.includes(lang));
      });
    }

    return result;
  }, [doctors, filters]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "specialization") {
      setFilters({ ...filters, specialization: value });
    } else {
      setFilters((prev) => {
        const current = prev[filterType];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [filterType]: updated };
      });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      specialization: "All",
      modeOfConsult: [],
      experienceRange: [],
      feeRange: [],
      languages: [],
    });
  };

  const handleBooking = (doctor, type) => {
    const bookingData = {
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      fee: doctor.consultationFee,
      consultType: type,
      img: doctor.img,
    };
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate("/booking");
  };

  return (
    <div className="find-doctors">
      {/* Hero Section */}
      <section className="hero-section container-fluid p-0">
        <div className="hero-overlay d-flex align-items-center">
          <div className="container">
            <h1 className="display-5 fw-bold text-white">Find & Consult Expert Doctors</h1>
            <p className="lead text-white-50">
              Book appointments with trusted specialists - online or in-person
            </p>
          </div>
        </div>
      </section>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar Filters */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="filters-sidebar sticky-top">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Filters</h5>
                <button className="btn btn-link btn-sm text-brand p-0" onClick={clearAllFilters}>
                  Clear All
                </button>
              </div>

              {/* Mode of Consult */}
              <div className="filter-section">
                <h6 className="filter-title">Mode of Consult</h6>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="hospital-visit"
                    checked={filters.modeOfConsult.includes("Hospital Visit")}
                    onChange={() => handleFilterChange("modeOfConsult", "Hospital Visit")}
                  />
                  <label className="form-check-label" htmlFor="hospital-visit">
                    Hospital Visit
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="online-consult"
                    checked={filters.modeOfConsult.includes("Online Consult")}
                    onChange={() => handleFilterChange("modeOfConsult", "Online Consult")}
                  />
                  <label className="form-check-label" htmlFor="online-consult">
                    Online Consult
                  </label>
                </div>
              </div>

              {/* Experience */}
              <div className="filter-section">
                <h6 className="filter-title">Experience (In Years)</h6>
                {["0-5", "6-10", "11-16", "17+"].map((range) => (
                  <div className="form-check" key={range}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`exp-${range}`}
                      checked={filters.experienceRange.includes(range)}
                      onChange={() => handleFilterChange("experienceRange", range)}
                    />
                    <label className="form-check-label" htmlFor={`exp-${range}`}>
                      {range}
                    </label>
                  </div>
                ))}
              </div>

              {/* Fees */}
              <div className="filter-section">
                <h6 className="filter-title">Fees (In Rupees)</h6>
                {["100-500", "500-1000", "1000+"].map((range) => (
                  <div className="form-check" key={range}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`fee-${range}`}
                      checked={filters.feeRange.includes(range)}
                      onChange={() => handleFilterChange("feeRange", range)}
                    />
                    <label className="form-check-label" htmlFor={`fee-${range}`}>
                      ₹{range}
                    </label>
                  </div>
                ))}
              </div>

              {/* Language */}
              <div className="filter-section">
                <h6 className="filter-title">Language</h6>
                {[
                  "English",
                  "Hindi",
                  "Telugu",
                  ...(showAllLanguages
                    ? ["Marathi", "Tamil", "Gujarati", "Kannada"]
                    : []),
                ].map((lang) => (
                  <div className="form-check" key={lang}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`lang-${lang}`}
                      checked={filters.languages.includes(lang)}
                      onChange={() => handleFilterChange("languages", lang)}
                    />
                    <label className="form-check-label" htmlFor={`lang-${lang}`}>
                      {lang}
                    </label>
                  </div>
                ))}

                <button
                  className="btn btn-link btn-sm p-0 text-brand mt-2"
                  onClick={() => setShowAllLanguages(!showAllLanguages)}
                >
                  {showAllLanguages ? "- See Less" : "+ See More"}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">
                Consult{" "}
                {filters.specialization !== "All"
                  ? filters.specialization + "s"
                  : "Doctors"}{" "}
                Online
                <span className="text-muted ms-2">({filteredDoctors.length} doctors)</span>
              </h4>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  className={`btn btn-filter ${
                    filters.specialization === spec ? "active" : ""
                  }`}
                  onClick={() => handleFilterChange("specialization", spec)}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Doctor Cards */}
            <div className="doctors-list">
              {filteredDoctors.map((doctor) => (
                <article key={doctor.id} className="doctor-card card mb-3 shadow-sm border">
                  <div className="card-body p-4">
                    <div className="row">
                      <div className="col-auto">
                        <img
                          src={doctor.img || "/images/default-doctor.jpg"}
                          alt={doctor.name}
                          className="doctor-img rounded"
                        />
                      </div>

                      <div className="col">
                        <div className="row">
                          <div className="col-md-8">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <h5 className="card-title mb-0">Dr {doctor.name}</h5>
                              <i className="bi bi-info-circle text-muted"></i>
                            </div>
                            <p className="text-muted mb-1">{doctor.specialization}</p>
                            <p className="small text-secondary mb-2">
                              {doctor.experience} YEARS • {doctor.qualifications}
                            </p>
                            <p className="small mb-2">{doctor.location}</p>
                            <p className="small text-muted mb-3">{doctor.clinic}</p>
                          </div>

                          <div className="col-md-4 text-md-end">
                            {doctor.onTimeGuarantee && (
                              <span className="badge bg-primary mb-2 d-inline-block">
                                ON TIME GUARANTEE
                              </span>
                            )}
                            <div className="price-tag fs-4 fw-bold text-dark">
                              ₹{doctor.consultationFee}
                            </div>
                          </div>
                        </div>

                        <div className="row mt-3">
                          <div className="col-md-6 mb-2 mb-md-0">
                            {(doctor.modeOfConsult === "Online Consult" ||
                              doctor.modeOfConsult === "Both") && (
                              <button
                                className="btn btn-outline-teal w-100 py-2"
                                onClick={() => handleBooking(doctor, "online")}
                              >
                                <div className="fw-bold">Online Consult</div>
                                <small className="text-success">{doctor.availability}</small>
                              </button>
                            )}
                          </div>
                          <div className="col-md-6">
                            {(doctor.modeOfConsult === "Hospital Visit" ||
                              doctor.modeOfConsult === "Both") && (
                              <button
                                className="btn btn-teal w-100 py-2"
                                onClick={() => handleBooking(doctor, "visit")}
                              >
                                <div className="fw-bold">Visit Doctor</div>
                                <small>{doctor.availability}</small>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {filteredDoctors.length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-search fs-1 text-muted"></i>
                  <p className="text-muted mt-3">No doctors found matching your filters.</p>
                  <button className="btn btn-brand" onClick={clearAllFilters}>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
