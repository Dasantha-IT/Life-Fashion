import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Add employee
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
    } = req.body;

    if (!email || !password || !name || !employeeId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      profileImage: req.file?.filename || "",
    });

    const savedUser = await user.save();

    const employee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      profileImage: req.file?.filename || "",
    });

    await employee.save();

    res
      .status(200)
      .json({ success: true, message: "Employee created successfully" });
  } catch (error) {
    console.error("Error adding employee:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while adding employee" });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", "-password")
      .populate("department");

    res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching employee list" });
  }
};

// Get one employee
const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    let employee = await Employee.findById(id)
      .populate("userId", "-password")
      .populate("department");

    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", "-password")
        .populate("department");
    }

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching employee" });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const user = await User.findById(employee.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Associated user not found" });
    }

    await User.findByIdAndUpdate(user._id, { name });
    await Employee.findByIdAndUpdate(id, {
      maritalStatus,
      designation,
      department,
      salary,
      updatedAt: Date.now(),
    });

    res
      .status(200)
      .json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    res
      .status(500)
      .json({ success: false, message: "Error updating employee" });
  }
};

export { addEmployee, upload, getEmployees, getEmployee, updateEmployee };
