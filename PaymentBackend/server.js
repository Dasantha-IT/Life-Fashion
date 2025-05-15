import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import deliveryRouter from "./routes/DeliveryRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import departmentRouter from "./routes/departmentRoutes.js";
import returnRouter from "./routes/returnRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

// app config
const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/deliverys", deliveryRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/department", departmentRouter);
app.use("/api/return", returnRouter);
app.use("/uploads", express.static(path.join("public", "uploads")));

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on PORT: " + port));
