const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const customerCtrl = require("../controllers/customerController");

router.post("/", auth, role("ADMIN", "STAFF"), customerCtrl.createCustomer);
router.get("/", auth, role("ADMIN", "STAFF"), customerCtrl.getCustomers);
router.get("/:id", auth, customerCtrl.getCustomer);
router.put("/:id", auth, role("ADMIN", "STAFF"), customerCtrl.updateCustomer);
router.delete("/:id", auth, role("ADMIN"), customerCtrl.deleteCustomer);

module.exports = router;
