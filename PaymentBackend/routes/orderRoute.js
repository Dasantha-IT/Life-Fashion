import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  updateStatus,
  userOrders,
  verifyStripe,
  verifyRazorpay,
  deleteOrder,
  updateOrder,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.get("/list", adminAuth(["stock_admin"]), allOrders);
orderRouter.post("/status", adminAuth(["stock_admin"]), updateStatus);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.put("/update/:orderId", authUser, updateOrder);

// User Features
orderRouter.post("/userorders", authUser, userOrders);

// Verify payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

// Delete Order
orderRouter.post("/delete", adminAuth(["stock_admin"]), deleteOrder);

export default orderRouter;
