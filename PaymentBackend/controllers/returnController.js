import orderModel from "../models/orderModel.js";
import returnModel from "../models/returnModel.js";

// Request a return/refund
const requestReturn = async (req, res) => {
  try {
    const { orderId, reason, userId } = req.body;

    // Check if order exists and belongs to user
    const order = await orderModel.findOne({ orderId, userId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid order ID or access denied" });
    }

    // Prevent duplicate return
    const existingReturn = await returnModel.findOne({ orderId });
    if (existingReturn) {
      return res
        .status(400)
        .json({ success: false, message: "Return request already exists" });
    }

    // Create return request
    const newReturn = await returnModel.create({ orderId, userId, reason });
    res.status(200).json({
      success: true,
      message: "Return requested",
      returnRequest: newReturn,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update return request
const updateUserReturn = async (req, res) => {
  try {
    const { returnId, reason, userId } = req.body;

    const returnRequest = await returnModel.findById(returnId);
    if (!returnRequest || returnRequest.userId !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (returnRequest.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot update non-pending requests",
      });
    }

    returnRequest.reason = reason;
    await returnRequest.save();

    res.json({
      success: true,
      message: "Return reason updated",
      returnRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete return request
const deleteUserReturn = async (req, res) => {
  try {
    const { returnId } = req.params;
    const { userId } = req.body;

    const returnRequest = await returnModel.findById(returnId);
    if (!returnRequest || returnRequest.userId !== userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (returnRequest.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete non-pending requests",
      });
    }

    await returnModel.findByIdAndDelete(returnId);
    res.json({ success: true, message: "Return request deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update return status
const updateReturnStatus = async (req, res) => {
  try {
    const { returnId, status } = req.body; // e.g., Approved, Rejected, Refunded

    const updated = await returnModel.findByIdAndUpdate(
      returnId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Return not found" });
    }

    res.json({ success: true, message: "Status updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserReturns = async (req, res) => {
  try {
    const { userId } = req.body;
    const returns = await returnModel.find({ userId });
    res.json({ success: true, returns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Get all return requests
const getAllReturns = async (req, res) => {
  try {
    const returns = await returnModel.find();
    res.json({ success: true, returns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  requestReturn,
  updateUserReturn,
  deleteUserReturn,
  updateReturnStatus,
  getAllReturns,
  getUserReturns,
};
