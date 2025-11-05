import { sequelize } from "../config/db.js";
import Medicine from "./Medicine.js";
import Contact from "./Contact.js";
import Doctor from "./Doctor.js";
export { sequelize, Medicine };

const db = {};
db.sequelize = sequelize;
db.Medicine = Medicine;
db.Doctor = Doctor;
db.Contact = Contact; // <-- NEW

export default db;