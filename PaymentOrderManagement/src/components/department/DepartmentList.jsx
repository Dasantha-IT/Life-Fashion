import React, { useEffect, useState } from "react";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [depError, setDepError] = useState("");
  const [form, setForm] = useState({ dep_name: "", description: "" });
  const [editingId, setEditingId] = useState(null); // track if editing

  const fetchDepartments = async () => {
    setDepLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDepartments(res.data.departments);
      }
    } catch (err) {
      setDepError("Failed to fetch departments.");
    } finally {
      setDepLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editingId
      ? `http://localhost:5000/api/department/${editingId}`
      : "http://localhost:5000/api/department/add";

    const method = editingId ? "put" : "post";

    try {
      const res = await axios[method](endpoint, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setForm({ dep_name: "", description: "" });
        setEditingId(null);
        fetchDepartments();
      }
    } catch (err) {
      alert("Failed to save department");
    }
  };

  const handleEdit = (dep) => {
    setForm({ dep_name: dep.dep_name, description: dep.description });
    setEditingId(dep._id);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );
    if (!confirmed) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/department/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) fetchDepartments();
    } catch (err) {
      alert("Failed to delete department");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Department Management
          </h1>
          <p className="text-gray-600 mt-1">
            Add, edit, and manage company departments
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? "Update Department" : "Add New Department"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid gap-6 mb-6 md:grid-cols-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  name="dep_name"
                  value={form.dep_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Brief department description"
                  rows="2"
                />
              </div>
            </div>
            <div className="flex justify-end">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ dep_name: "", description: "" });
                    setEditingId(null);
                  }}
                  className="mr-3 px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? "Update" : "Add"} Department
              </button>
            </div>
          </form>
        </div>

        {/* Department List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Departments</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
              {departments.length} total
            </span>
          </div>

          {depLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-600">Loading departments...</p>
            </div>
          ) : depError ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{depError}</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No departments available.</p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first department using the form above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Department Name</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {departments.map((dep, index) => (
                    <tr key={dep._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {dep.dep_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {dep.description || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <button
                          onClick={() => handleEdit(dep)}
                          className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(dep._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;
