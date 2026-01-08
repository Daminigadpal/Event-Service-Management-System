const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const packageCtrl = require("../controllers/packageController");

router.post("/", auth, role("ADMIN"), packageCtrl.createPackage);
router.get("/", packageCtrl.getPackages);
router.put("/:id", auth, role("ADMIN"), packageCtrl.updatePackage);
router.delete("/:id", auth, role("ADMIN"), packageCtrl.deletePackage);

module.exports = router;
