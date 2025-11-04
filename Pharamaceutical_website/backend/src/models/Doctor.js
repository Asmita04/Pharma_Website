import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const SPECIALIZATION_ENUM = [
  "Urologist",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic",
  "Gynecologist",
  "Neurologist",
  "Dentist",
  "General Physician",
  "Psychiatrist",
  "Ophthalmologist",
  "ENT Specialist",
];

const MODE_OF_CONSULT_ENUM = ["Hospital Visit", "Online Consult", "Both"];

const LANGUAGE_ENUM = [
  "English",
  "Hindi",
  "Marathi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Odia",
];

export const Doctor = sequelize.define(
  "Doctor",
  {
    doctor_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    doctor_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Doctor name is required" },
      },
    },
    contact_no: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Contact number is required" },
        is: /^[0-9+\-\s()]*$/i,
        len: {
          args: [8, 15],
          msg: "Contact number must be between 8 and 15 characters",
        },
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Address is required" },
      },
    },
    specialization: {
      type: DataTypes.ENUM(...SPECIALIZATION_ENUM),
      allowNull: false,
    },
    modeOfConsult: {
      type: DataTypes.ENUM(...MODE_OF_CONSULT_ENUM),
      allowNull: false,
      defaultValue: "Both",
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Experience cannot be negative",
        },
        max: {
          args: [60],
          msg: "Experience cannot exceed 60 years",
        },
      },
      comment: "Years of experience",
    },
    consultationFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: {
          args: [0],
          msg: "Consultation fee cannot be negative",
        },
      },
      comment: "Consultation fee in rupees",
    },
    languages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: ["English"],
      validate: {
        isValidLanguages(value) {
          if (!Array.isArray(value)) {
            throw new Error("Languages must be an array");
          }
          const invalidLangs = value.filter(lang => !LANGUAGE_ENUM.includes(lang));
          if (invalidLangs.length > 0) {
            throw new Error(`Invalid languages: ${invalidLangs.join(", ")}`);
          }
        },
      },
      comment: "Array of languages spoken by doctor",
    },
  },
  {
    tableName: "doctors",
    timestamps: true,
    // REMOVED indexes - they might be causing conflicts with existing ones
    indexes: []
  }
);

export default Doctor;