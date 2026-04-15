const express = require("express");
const router = express.Router();


const { getLogById } = require("../controllers/controller");
const { getStats } = require("../controllers/controller");
const { getRecentLogs } = require("../controllers/controller");
const { getAllLogsByUser } = require("../controllers/controller");
const { getLogsByRange } = require("../controllers/controller");
const { getLogs } = require("../controllers/controller");

const { login, signup } = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");

router.post("/login", login);
router.post("/signup", signup);


// Protected routes
router.get("/logs", authenticateToken, getLogs);
router.get("/logs/range", authenticateToken, getLogsByRange);
router.get("/logs/:id", authenticateToken, getLogById);
router.get("/stats", authenticateToken, getStats);
router.get("/recent", authenticateToken, getRecentLogs);
router.get("/logs/user/:whatsappNumber", authenticateToken, getAllLogsByUser);
 
module.exports = router;