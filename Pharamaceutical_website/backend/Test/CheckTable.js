import { sequelize } from "../config/db.js";
import { Doctor } from "../models/Doctor.js";

async function checkTable() {
  try {
    // Sync the database
    await sequelize.sync({ alter: true });
    
    console.log("Database connected successfully");
    
    // Get table info
    const tableInfo = await sequelize.getQueryInterface().describeTable('doctors');
    
    console.log("\nDoctors table structure:");
    console.log(tableInfo);
    
    // Count records
    const count = await Doctor.count();
    console.log(`\nTotal doctors in database: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkTable();