const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const scheduleCtrl = require("../controllers/scheduleController");

router.post("/", auth, role("ADMIN"), scheduleCtrl.createSchedule);
router.get("/:staffId", auth, role("ADMIN", "STAFF"), scheduleCtrl.getStaffSchedule);
router.put("/:id", auth, role("ADMIN"), scheduleCtrl.updateSchedule);
router.delete("/:id", auth, role("ADMIN"), scheduleCtrl.deleteSchedule);

module.exports = router;
