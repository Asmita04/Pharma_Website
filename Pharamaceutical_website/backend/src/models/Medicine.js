import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

/**
 * NOTE on "desc":
 * DESC is an SQL keyword. To avoid conflicts while keeping your API field as "desc",
 * we map it to a real DB column named "description" using Sequelize's "field" option.
 */

const CATEGORY_ENUM = [
  "Diabetic Care",
  "Stomach Care",
  "Liver Care",
  "Cold & Immunity",
  "Pain Relief",
  "Personal Care",
];

export const Medicine = sequelize.define(
  "Medicine",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(...CATEGORY_ENUM),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0, max: 5 },
    },
    pack: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    // API field "desc" -> DB column "description"
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "description",
    },
    img: {
      type: DataTypes.STRING(255), // e.g., "/images/glucoGuard.jpg"
      allowNull: true,
    },
  },
  {
    tableName: "medicines",
    timestamps: true, // adds createdAt, updatedAt
    indexes: [{ fields: ["category"] }, { fields: ["name"] }],
  }
);

export default Medicine;
