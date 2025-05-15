import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const returnModel =
  mongoose.models.return || mongoose.model("return", returnSchema);
export default returnModel;
