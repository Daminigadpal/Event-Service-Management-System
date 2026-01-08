import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getUsers, getUser } from "../controllers/userController.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/", getUsers);
router.get("/:id", getUser);

export default router;
