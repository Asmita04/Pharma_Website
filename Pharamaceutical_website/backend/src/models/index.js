import { sequelize } from "../config/db.js";
import Medicine from "./Medicine.js";
import Contact from "./Contact.js";


const db = {};
db.sequelize = sequelize;
db.Medicine = Medicine;
db.Contact = Contact; // <-- NEW

export default db;