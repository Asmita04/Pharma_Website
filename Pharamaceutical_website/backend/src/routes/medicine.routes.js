import { Router } from "express";
import {
  createMedicine,
  listMedicines,
  getMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicine.controller.js";

const router = Router();

router.get("/", listMedicines);
router.get("/:id", getMedicine);
router.post("/", createMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;
