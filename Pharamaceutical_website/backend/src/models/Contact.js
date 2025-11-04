// backend/src/models/Contact.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Contact = sequelize.define(
  "contact",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { isEmail: true },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "contacts", // ✅ Ensures table name = 'contacts'
    timestamps: true, // ✅ Adds createdAt and updatedAt automatically
  }
);

export default Contact;
