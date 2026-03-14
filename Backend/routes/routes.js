const express = require("express");
const router = express.Router();


const { getLogById } = require("../controllers/controller");
const { getStats } = require("../controllers/controller");
const { getRecentLogs } = require("../controllers/controller");
const { getAllLogsByUser } = require("../controllers/controller");
const { getLogsByRange } = require("../controllers/controller");
const { getLogs } = require("../controllers/controller");
const { login } = require("../controllers/authController");
router.post("/login", login);

router.get("/logs", getLogs);
router.get("/logs/range", getLogsByRange);
router.get("/logs/:id", getLogById);
router.get("/stats", getStats);
router.get("/recent", getRecentLogs);
router.get("/logs/user/:whatsappNumber", getAllLogsByUser);
 
module.exports = router;