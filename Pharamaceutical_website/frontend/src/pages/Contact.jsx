import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("http://localhost:5012/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(`❌ ${data.message || "Failed to send message"}`);
      }
    } catch (err) {
      setStatus("❌ Server error. Try again later.");
    }
  };

  return (
    <div className="contact-wrapper">
      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          Have any questions or feedback? We’re here to help you 24/7.
        </p>
      </section>

      <section className="contact-content">
        <div className="contact-card">
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Message</button>
          </form>
          {status && <p className="form-status">{status}</p>}
        </div>

        <div className="contact-details">
          <h2>Our Office</h2>
          <p>📍 123 Wellness Avenue, Mumbai, India</p>
          <p>📧 support@pharmasite.com</p>
          <p>📞 +91 98765 43210</p>
        </div>
        <div className="contact-image"></div>
      </section>
    </div>
  );
}

export default Contact;
