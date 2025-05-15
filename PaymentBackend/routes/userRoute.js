import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  sendOTP,
  verifyOTP,
  resetPasswordWithOTP,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/forgot-password/send-otp", sendOTP);
userRouter.post("/forgot-password/verify-otp", verifyOTP);
userRouter.post("/forgot-password/reset", resetPasswordWithOTP);

export default userRouter;
