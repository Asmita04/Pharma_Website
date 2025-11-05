// backend/src/routes/contact.routes.js
import express from "express";
import { saveContact } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", saveContact);

export default router;
