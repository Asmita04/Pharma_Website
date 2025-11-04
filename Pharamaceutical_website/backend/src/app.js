import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";
import medicineRoutes from "./routes/medicine.routes.js";
import doctorRoutes from "./routes/doctor.routes.js"; // ADD THIS LINE

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("Pharmacy API OK"));

//test get doctors
// Debug test
app.get("/api/doctors/test", (req, res) => {
  res.send("✅ Doctor test route OK");
});


// Routes
app.use("/api/medicines", medicineRoutes);
app.use("/api/doctors", doctorRoutes); // ADD THIS LINE

// Database connection and sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected");
    
    await sequelize.sync({ alter: true }); // Changed to alter: true to update existing tables
    console.log("✅ Models synced");
  } catch (err) {
    console.error("❌ DB error:", err.message);
  }
})();

// Start server
const PORT = process.env.PORT || 5036;
app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));