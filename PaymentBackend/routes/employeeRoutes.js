import express from "express";
import {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
} from "../controllers/employeeController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post(
  "/add",
  upload.single("profileImage"),
  adminAuth(["main_admin"]),
  addEmployee
);

router.get("/", adminAuth(["main_admin"]), getEmployees);
router.get("/:id", adminAuth(["main_admin"]), getEmployee);
router.put("/:id", adminAuth(["main_admin"]), updateEmployee);

export default router;
