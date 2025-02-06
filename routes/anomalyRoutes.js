const express = require("express");
const { getAllAnomalies, getAnomalyById, addAnomaly, deleteAnomaly } = require("../controllers/anomalyController");

const router = express.Router();

// Fetch all detected anomalies
router.get("/", getAllAnomalies);

// Fetch a single anomaly by ID
router.get("/:id", getAnomalyById);

// Add a new anomaly
router.post("/", addAnomaly);

// Delete an anomaly by ID
router.delete("/:id", deleteAnomaly);

module.exports = router;
