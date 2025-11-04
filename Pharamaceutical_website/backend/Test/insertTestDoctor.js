import { sequelize } from "../config/db.js";
import { Doctor } from "../models/Doctor.js";

async function insertTestDoctor() {
  try {
    await sequelize.sync({ alter: true });
    
    // Create a test doctor
    const doctor = await Doctor.create({
      name: "Tharaka Mourya Nutulapati",
      specialization: "Urologist",
      qualifications: "MBBS, MS (GENERAL SURGERY)",
      experience: 7,
      consultationFee: 770,
      rating: 4.5,
      location: "Visakhapatnam",
      clinic: "Apollo 24|7 Clinic",
      address: "Apollo Clinic, Visakhapatnam",
      modeOfConsult: "Both",
      languages: ["English", "Hindi", "Telugu"],
      availability: "Available in 10 minutes",
      onTimeGuarantee: true,
      img: "/images/doctor1.jpg",
      bio: "Experienced urologist"
    });
    
    console.log("Test doctor created successfully!");
    console.log("Doctor ID:", doctor.id);
    console.log("Doctor Name:", doctor.name);
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

insertTestDoctor();