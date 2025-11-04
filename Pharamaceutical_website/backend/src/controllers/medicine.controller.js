import { Medicine } from "../models/Medicine.js";
import { Op } from "sequelize";

// Create
export const createMedicine = async (req, res) => {
  try {
    const med = await Medicine.create(req.body);
    res.status(201).json(med);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// List (with basic filters)
export const listMedicines = async (req, res) => {
  try {
    const { q, category } = req.query;
    const where = {};
    if (q) where.name = { [Op.like]: `%${q}%` };
    if (category) where.category = category;
    const items = await Medicine.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Get one
export const getMedicine = async (req, res) => {
  try {
    const med = await Medicine.findByPk(req.params.id);
    if (!med) return res.status(404).json({ error: "Not found" });
    res.json(med);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Update
export const updateMedicine = async (req, res) => {
  try {
    const med = await Medicine.findByPk(req.params.id);
    if (!med) return res.status(404).json({ error: "Not found" });
    await med.update(req.body);
    res.json(med);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Delete
export const deleteMedicine = async (req, res) => {
  try {
    const med = await Medicine.findByPk(req.params.id);
    if (!med) return res.status(404).json({ error: "Not found" });
    await med.destroy();
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
