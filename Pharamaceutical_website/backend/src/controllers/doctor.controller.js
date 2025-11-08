import { Doctor } from "../models/Doctor.js";
import { Op } from "sequelize";

// Create a new doctor
export const createDoctor = async (req, res) => {
  try {
    console.log("Creating new doctor...");
    console.log("Request body:", req.body);
    
    // Doctor.create() inserts a new record into the database
    const doctor = await Doctor.create(req.body);

    console.log(" Doctor created successfully with ID:", doctor.id);

    // Status 201 means "Created" (successful creation)
    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor
    });

  } catch (error) {
    console.error(" Error creating doctor:", error.message);
    
    // Status 400 means "Bad Request" (validation error or wrong data)
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// List doctors with advanced filters
export const listDoctors = async (req, res) => {
  try {
    console.log("Fetching doctors list...");
    console.log("Query params:", req.query);

    const {
      q,
      specialization,
      modeOfConsult,
      experienceMin,
      experienceMax,
      feeMin,
      feeMax,
      language,
    } = req.query;

    const where = {};

    // Filter 1: Search by doctor name
    if (q) {
      where.doctor_name = { [Op.like]: `%${q}%` };
      console.log(`Searching for: "${q}"`);
    }

    // Filter 2: Filter by specialization
    if (specialization && specialization !== "All") {
      where.specialization = specialization;
      console.log(`Filtering by specialization: ${specialization}`);
    }

    // Filter 3: Filter by mode of consult
    if (modeOfConsult) {
      where.modeOfConsult = { [Op.in]: [modeOfConsult, "Both"] };
      console.log(`Filtering by mode: ${modeOfConsult}`);
    }

    // Filter 4: Filter by experience range
    if (experienceMin || experienceMax) {
      where.experience = {};
      if (experienceMin) {
        where.experience[Op.gte] = parseInt(experienceMin);
        console.log(`Minimum experience: ${experienceMin} years`);
      }
      if (experienceMax) {
        where.experience[Op.lte] = parseInt(experienceMax);
        console.log(`Maximum experience: ${experienceMax} years`);
      }
    }

    // Filter 5: Filter by consultation fee range
    if (feeMin || feeMax) {
      where.consultationFee = {};
      if (feeMin) {
        where.consultationFee[Op.gte] = parseFloat(feeMin);
        console.log(`Minimum fee: ₹${feeMin}`);
      }
      if (feeMax) {
        where.consultationFee[Op.lte] = parseFloat(feeMax);
        console.log(`Maximum fee: ₹${feeMax}`);
      }
    }

    // Filter 6: Filter by language
    // Note: languages is stored as JSON array, so we search within it
    if (language) {
      // CONCEPT: Using Op.like to search in JSON array
      // This checks if the language exists in the JSON array
      where.languages = {
        [Op.like]: `%"${language}"%`,
      };
      console.log(`Filtering by language: ${language}`);
    }

    // Fetch doctors from database with all filters
    const doctors = await Doctor.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    console.log(`Found ${doctors.length} doctors`);

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error(" Error fetching doctors:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single doctor by ID
export const getDoctor = async (req, res) => {
  try {

    const doctorId = req.params.id;
    console.log(`Fetching doctor with ID: ${doctorId}`);
    const doctor = await Doctor.findByPk(doctorId);

     if (!doctor) {
      return res.status(404).json({ 
        success: false,
        error: "Doctor not found" 
      });
    }
     res.status(200).json({
      success: true,
      data: doctor
    });

  } catch (error) {
    res.status(500).json({  
        success: false, error: e.message 
    });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    console.log(`Updating doctor with ID: ${doctorId}`);
    console.log("Update data:", req.body);
    const doctor = await Doctor.findByPk(doctorId);

    // If doctor doesn't exist, return 404
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found"
      });
    }
    // Only updates fields that are provided in req.body
    await doctor.update(req.body);

    console.log("Doctor updated successfully");

    res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor
    });

  } catch (error) {
    console.error(" Error updating doctor:", error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};


// // Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    console.log(`Deleting doctor with ID: ${doctorId}`);

    // Find the doctor
    const doctor = await Doctor.findByPk(doctorId);

    // If doctor doesn't exist, return 404
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found"
      });
    }

    // Store doctor name before deletion
    const doctorName = doctor.doctor_name;

    // Permanently delete the record from database
    await doctor.destroy();

    console.log(`Doctor "${doctorName}" deleted successfully`);

    // Status 204 means "No Content" - successful deletion
    res.status(200).json({
      success: true,
      message: `Doctor "${doctorName}" deleted successfully`
    });

  } catch (error) {
    console.error(" Error deleting doctor:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};