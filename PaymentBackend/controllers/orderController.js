import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { sendLowStockEmail } from "../utils/emailService.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import { sendOrderConfirmationEmail } from "../utils/emailService.js";

// Global Variables
const currency = "lkr";
const deliveryCharge = 450;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateOrderId = () => {
  const prefix = "ORD";
  const timestamp = Date.now().toString().slice(-6); // last 6 digits
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `${prefix}-${timestamp}-${random}`;
};

// Placing orders using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      orderId: generateOrderId(),
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    for (const item of items) {
      const product = await productModel.findById(item._id);
      if (product) {
        product.quantity = Math.max(0, product.quantity - item.quantity);
        await product.save();

        if (product.quantity <= 5) {
          await sendLowStockEmail(product);
        }
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const user = await userModel.findById(userId);
    if (user) {
      await sendOrderConfirmationEmail(user, newOrder.orderId);
    }

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe method
// const placeOrderStripe = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;
//     const { origin } = req.headers;

//     const orderData = {
//       userId,
//       items,
//       address,
//       amount,
//       paymentMethod: "Stripe",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const line_items = items.map((item) => ({
//       price_data: {
//         currency: currency,
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100,
//       },
//       quantity: item.quantity,
//     }));

//     line_items.push({
//       price_data: {
//         currency: currency,
//         product_data: {
//           name: "Delivery Charges",
//         },
//         unit_amount: deliveryCharge * 100,
//       },
//       quantity: 1,
//     });

//     const session = await stripe.checkout.sessions.create({
//       success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
//       cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
//       line_items,
//       mode: "payment",
//     });

//     res.json({ success: true, session_url: session.url });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // Verify Stripe
// const verifyStripe = async (req, res) => {
//   const { orderId, success, userId } = req.body;

//   try {
//     if (success === "true") {
//       const order = await orderModel.findById(orderId);
//       if (!order) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Order not found" });
//       }

//       // Update product quantities
//       for (const item of order.items) {
//         const product = await productModel.findById(item._id);
//         if (product) {
//           product.quantity = Math.max(0, product.quantity - item.quantity);
//           await product.save();

//           if (product.quantity <= 5) {
//             await sendLowStockEmail(product);
//           }
//         }
//       }

//       // Mark order paid and clear cart
//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       await userModel.findByIdAndUpdate(userId, { cartData: {} });

//       res.json({ success: true });
//     } else {
//       await orderModel.findByIdAndDelete(orderId);
//       res.json({ success: false });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // Placing orders using Razorpay method
// const placeOrderRazorpay = async (req, res) => {
//   try {
//     const { userId, items, amount, address } = req.body;

//     const orderData = {
//       userId,
//       items,
//       address,
//       amount,
//       paymentMethod: "Razorpay",
//       payment: false,
//       date: Date.now(),
//     };

//     const newOrder = new orderModel(orderData);
//     await newOrder.save();

//     const options = {
//       amount: amount * 100,
//       currency: currency.toUpperCase(),
//       receipt: newOrder._id.toString(),
//     };

//     await razorpayInstance.orders.create(options, (error, order) => {
//       if (error) {
//         console.log(error);
//         return res.json({ success: false, message: error });
//       }

//       res.json({ success: true, order });
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// const verifyRazorpay = async (req, res) => {
//   try {
//     const { userId, razorpay_order_id } = req.body;

//     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
//     const orderId = orderInfo.receipt;

//     if (orderInfo.status === "paid") {
//       const order = await orderModel.findById(orderId);
//       if (!order) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Order not found" });
//       }

//       // Update product quantities
//       for (const item of order.items) {
//         const product = await productModel.findById(item._id);
//         if (product) {
//           product.quantity = Math.max(0, product.quantity - item.quantity);
//           await product.save();

//           if (product.quantity <= 5) {
//             await sendLowStockEmail(product);
//           }
//         }
//       }

//       await orderModel.findByIdAndUpdate(orderId, { payment: true });
//       await userModel.findByIdAndUpdate(userId, { cartData: {} });

//       res.json({ success: true });
//     } else {
//       await orderModel.findByIdAndDelete(orderInfo.receipt);
//       res.json({ success: false });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const generatedOrderId = generateOrderId();

    const orderData = {
      orderId: generatedOrderId,
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${generatedOrderId}`,
      cancel_url: `${origin}/verify?success=false&orderId=${generatedOrderId}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    const order = await orderModel.findOne({ orderId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (success === "true") {
      // Update stock
      for (const item of order.items) {
        const product = await productModel.findById(item._id);
        if (product) {
          product.quantity = Math.max(0, product.quantity - item.quantity);
          await product.save();

          if (product.quantity <= 5) {
            await sendLowStockEmail(product);
          }
        }
      }

      await orderModel.updateOne({ orderId }, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      return res.json({ success: true });
    } else {
      await orderModel.deleteOne({ orderId });
      return res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const generatedOrderId = generateOrderId();

    const orderData = {
      orderId: generatedOrderId,
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: generatedOrderId,
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error });
      }

      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    const orderId = orderInfo.receipt;

    const order = await orderModel.findOne({ orderId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (orderInfo.status === "paid") {
      for (const item of order.items) {
        const product = await productModel.findById(item._id);
        if (product) {
          product.quantity = Math.max(0, product.quantity - item.quantity);
          await product.save();

          if (product.quantity <= 5) {
            await sendLowStockEmail(product);
          }
        }
      }

      await orderModel.updateOne({ orderId }, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true });
    } else {
      await orderModel.deleteOne({ orderId });
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders Data fro Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from admin pannel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Deleting an order from admin panel
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const deletedOrder = await orderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { address, deliveryStatus } = req.body;

    const updatedFields = {};
    if (address) updatedFields.address = address;
    if (deliveryStatus) updatedFields.deliveryStatus = deliveryStatus;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      updatedFields,
      {
        new: true,
      }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order updated", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default deleteOrder;

export {
  verifyRazorpay,
  updateOrder,
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  deleteOrder,
};
