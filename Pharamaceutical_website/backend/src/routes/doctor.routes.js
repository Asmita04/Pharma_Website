import express from "express";
import { getDoctor,createDoctor, listDoctors, updateDoctor, deleteDoctor} from "../controllers/doctor.controller.js";

const router = express.Router();
router.get("/:id", getDoctor);
router.post("/",createDoctor);
router.get("/", listDoctors);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;