const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.js");
const role = require("../middleware/roleMiddleware");
const packageCtrl = require("../controllers/packageController.js");

router.post("/", protect, role("ADMIN"), packageCtrl.createPackage);
router.get("/", packageCtrl.getPackages);
router.put("/:id", protect, role("ADMIN"), packageCtrl.updatePackage);
router.delete("/:id", protect, role("ADMIN"), packageCtrl.deletePackage);

module.exports = router;
