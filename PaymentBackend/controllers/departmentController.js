import Department from "../models/departmentModel.js";

// Add Department
const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    // Validation
    if (!dep_name || dep_name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Department name is required.",
      });
    }

    const existing = await Department.findOne({ dep_name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department already exists.",
      });
    }

    const department = new Department({ dep_name, description });
    await department.save();

    res.json({ success: true, message: "Department added", department });
  } catch (error) {
    console.error("Add Department Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Department
const updateDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Department ID is required.",
      });
    }

    if (!dep_name || dep_name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Department name is required.",
      });
    }

    const updated = await Department.findByIdAndUpdate(
      id,
      { dep_name, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    res.json({
      success: true,
      message: "Department updated",
      department: updated,
    });
  } catch (error) {
    console.error("Update Department Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Departments
const listDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json({ success: true, departments });
  } catch (error) {
    console.error("List Departments Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Department
const removeDepartment = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    await Department.findByIdAndDelete(id);
    res.json({ success: true, message: "Department removed" });
  } catch (error) {
    console.error("Delete Department Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Single Department by ID
const singleDepartment = async (req, res) => {
  try {
    const { id } = req.body;
    const department = await Department.findById(id);

    if (!department) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.json({ success: true, department });
  } catch (error) {
    console.error("Single Department Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addDepartment,
  updateDepartment,
  listDepartments,
  removeDepartment,
  singleDepartment,
};
