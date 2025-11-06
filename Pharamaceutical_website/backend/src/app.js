// backend/src/app.js
import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";
import medicineRoutes from "./routes/medicine.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import { fileURLToPath } from "url";

// ✅ Import models *before* sync
import "./models/Medicine.js";
import "./models/Doctor.js";
import "./models/Contact.js"; // use path import, no variable needed
import "./models/User.js";
import Doctor from "./models/Doctor.js";
import uploadRoutes from "./routes/upload.routes.js";

dotenv.config();
console.log("Using database:", process.env.DB_NAME);


const app = express();

app.use(cors());
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ✅ Default route
app.get("/", (req, res) => res.send("Pharmacy API OK"));

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/doctors",doctorRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", uploadRoutes);

// ✅ Connect DB and sync models
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected");

    // force: false means don’t drop table, alter ensures structure is correct
    await sequelize.sync({ alter: true });
    console.log("✅ Models synced (including Contact)");
  } catch (err) {
    console.error("❌ DB error:", err.message);
  }
})();

const PORT = process.env.PORT || 5012;
app.listen(PORT, () => console.log(`🚀 API listening on port ${PORT}`));
