import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Read & clear any saved login intent
  const popIntent = () => {
    const intent = localStorage.getItem("intent") || "";
    const returnTo = localStorage.getItem("returnTo") || "";
    const cartItem = localStorage.getItem("intentCartItem"); // optional: if you also save an item to add later
    localStorage.removeItem("intent");
    localStorage.removeItem("returnTo");
    if (cartItem) localStorage.removeItem("intentCartItem");
    return { intent, returnTo, cartItem: cartItem ? JSON.parse(cartItem) : null };
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password required");
      return;
    }

    // 🔐 Admin shortcut (same login page)
    if (form.email === "admin@gmail.com" && form.password === "admin123") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("token", "admin-static-token"); // placeholder token

      const { intent, returnTo } = popIntent();
      if (intent === "buynow") {
        navigate("/cart");
      } else if (returnTo) {
        navigate(returnTo);
      } else {
        navigate("/admin/dashboard");
      }
      return;
    }

    // 👤 Normal user login via API
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5012/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "user");

        const { intent, returnTo } = popIntent();
        if (intent === "buynow") {
          navigate("/cart");
        } else if (returnTo) {
          navigate(returnTo);
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError("Cannot reach server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="form-control"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {error && <div className="input-error">{error}</div>}
          <button className="form-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
