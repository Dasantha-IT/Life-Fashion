import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  addDepartment,
  updateDepartment,
  listDepartments,
  removeDepartment,
  singleDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

router.get("/", adminAuth(["main_admin"]), listDepartments);
router.post("/add", adminAuth(["main_admin"]), addDepartment);
router.get("/:id", adminAuth(["main_admin"]), singleDepartment);
router.put("/:id", adminAuth(["main_admin"]), updateDepartment);
router.delete("/:id", adminAuth(["main_admin"]), removeDepartment);

export default router;
