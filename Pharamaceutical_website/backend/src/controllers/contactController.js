import Contact from "../models/Contact.js";

export const saveContact = async (req, res) => {
  try {
    // Confirm body is actually coming through
    // console.log("BODY:", req.body);

    const name = (req.body?.name || "").trim();
    const email = (req.body?.email || "").trim();
    const message = (req.body?.message || "").trim();

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({ name, email, message });

    return res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: contact,
    });
  } catch (err) {
    console.error("❌ Error inserting contact data:", err);
    return res.status(500).json({
      message: "Server error while saving contact",
      error: err?.message,
    });
  }
};