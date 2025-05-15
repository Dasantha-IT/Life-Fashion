import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { transporter } from "../utils/emailService.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const createAdminToken = (role) =>
  jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: "2d" });

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // Send Welcome Email
    try {
      await transporter.sendMail({
        to: user.email,
        subject: "Welcome to Life Fashion",
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px;">
    <h2 style="color: #4A154B;">Welcome to Life Fashion, ${user.name}!</h2>
    <p>We're excited to have you on board. 🎉</p>
    <p>You can now log in to your account and explore the latest in style and trends.</p>
    <p>If you have any questions or need support, feel free to contact us anytime.</p>
    <p style="margin-top: 30px;">– The Life Fashion Team</p>
  </div>
</body>
</html>`,
      });
    } catch (error) {
      console.error("Failed to send welcome email:", err);
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log("Register Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First, check if it's a hardcoded admin login
    let role = null;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      role = "main_admin";
    } else if (
      email === process.env.STOCK_ADMIN_EMAIL &&
      password === process.env.STOCK_ADMIN_PASSWORD
    ) {
      role = "stock_admin";
    }

    if (role) {
      const token = createAdminToken(role);
      return res.json({ success: true, token, role });
    }

    // 🔍 Check if it's a registered employee
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid password" });
    }

    if (user.role !== "employee") {
      return res.json({ success: false, message: "Unauthorized role" });
    }

    // Create token with employee role
    const token = createAdminToken(user.role, user._id);

    return res.json({ success: true, token, role: user.role, name: user.name });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Send OTP to Email
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() }); // Lowercase match

    if (!user) {
      return res.json({ success: false, message: "Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes
    await user.save();

    await transporter.sendMail({
      to: user.email,
      subject: "Your OTP Code - Life Fashion",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background-color: #4A154B; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Life Fashion</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px 25px;">
      <p style="font-size: 16px; color: #333;">Hello <strong>${user.name}</strong>,</p>
      
      <p style="font-size: 16px; color: #333; margin-bottom: 25px;">Please use the following code to verify your account:</p>
      
      <!-- OTP Code Box -->
      <div style="background-color: #f7f7f9; border-radius: 6px; padding: 15px; text-align: center; margin: 20px 0;">
        <h2 style="font-size: 28px; letter-spacing: 3px; color: #4A154B; margin: 10px 0;">${otp}</h2>
      </div>
      
      <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
      
      <p style="font-size: 16px; color: #333; margin-top: 25px;">Thank you,<br>Life Fashion Security Team</p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f7f7f9; padding: 15px; text-align: center; font-size: 12px; color: #666;">
      <p>&copy; 2025 Life Fashion. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
    });

    res.json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({
      email,
      otpCode: otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.json({ success: false, message: "Invalid or expired OTP." });

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res
      .status(500)
      .json({ success: false, message: "OTP verification failed." });
  }
};

// Reset Password with OTP
const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({
      email,
      otpCode: otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.json({ success: false, message: "Invalid or expired OTP." });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ success: false, message: "Password reset failed." });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  sendOTP,
  verifyOTP,
  resetPasswordWithOTP,
};
