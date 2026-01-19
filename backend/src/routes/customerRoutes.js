const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.js");
const role = require("../middleware/roleMiddleware");
const customerCtrl = require("../controllers/customerController");

router.post("/", protect, role("ADMIN", "STAFF"), customerCtrl.createCustomer);
router.get("/", protect, role("ADMIN", "STAFF"), customerCtrl.getCustomers);
router.get("/:id", protect, customerCtrl.getCustomer);
router.put("/:id", protect, role("ADMIN", "STAFF"), customerCtrl.updateCustomer);
router.delete("/:id", protect, role("ADMIN", "STAFF"), customerCtrl.deleteCustomer);

module.exports = router;
