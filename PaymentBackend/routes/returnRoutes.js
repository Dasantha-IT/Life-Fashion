import express from "express";
import {
  requestReturn,
  updateUserReturn,
  deleteUserReturn,
  updateReturnStatus,
  getAllReturns,
  getUserReturns,
} from "../controllers/returnController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/request", authUser, requestReturn);
router.put("/user/update", authUser, updateUserReturn);
router.delete("/user/delete/:returnId", authUser, deleteUserReturn);
router.get("/user", authUser, getUserReturns);

// Admin-protected routes
router.put("/update", adminAuth(["main_admin"]), updateReturnStatus);
router.get("/", adminAuth(["main_admin"]), getAllReturns);

export default router;
