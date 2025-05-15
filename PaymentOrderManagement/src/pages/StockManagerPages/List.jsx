import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../../App";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    sizes: [],
  });

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setUpdatedData({
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subCategory,
      price: product.price,
      sizes: product.sizes || [],
      quantity: product.quantity,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (size) => {
    setUpdatedData((prev) => {
      if (prev.sizes.includes(size)) {
        return { ...prev, sizes: prev.sizes.filter((s) => s !== size) };
      } else {
        return { ...prev, sizes: [...prev.sizes, size] };
      }
    });
  };

  const saveUpdatedProduct = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/update",
        {
          id: editingProduct,
          ...updatedData,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditingProduct(null); // close the modal
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMsg);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Product List", 14, 22);

    const tableColumn = ["Name", "Category", "Price", "Quantity", "Sizes"];
    const tableRows = [];

    list.forEach((item) => {
      const row = [
        item.name,
        item.category,
        `${currency}${item.price}`,
        item.quantity,
        item.sizes?.join(", ") || "N/A",
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });

    doc.save("product-list.pdf");
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">All Products List</p>
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Download PDF
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {/* ------------- List Table Title ---------------*/}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1.5fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>quantity</b>
          <b className="text-center">Action</b>
        </div>

        {/*------------------Product List---------------*/}

        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1.5fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1.5fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <p>{item.quantity}</p>
            <div className="flex gap-2 justify-center items-center">
              <p
                onClick={() => removeProduct(item._id)}
                className="text-right md:text-center cursor-pointer text-lg"
              >
                X
              </p>
              <button onClick={() => startEditing(item)} className=" ml-2">
                Edit
              </button>
            </div>
          </div>
        ))}

        {/* ------------------- Product Update --------------- */}

        {editingProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 md:p-8 animate-fade-in max-h-[98vh] my-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Edit Product
                </h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={updatedData.name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={updatedData.description || ""}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white resize-none transition-all"
                    placeholder="Enter product description"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={updatedData.category || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white appearance-none cursor-pointer transition-all"
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Subcategory
                    </label>
                    <select
                      name="subcategory"
                      value={updatedData.subcategory || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white appearance-none cursor-pointer transition-all"
                    >
                      <option value="" disabled>
                        Select subcategory
                      </option>
                      <option value="Topwear">Topwear</option>
                      <option value="Bottomwear">Bottomwear</option>
                      <option value="Winterwear">Winterwear</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={updatedData.price || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={updatedData.quantity || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition-all"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeChange(size)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          updatedData.sizes.includes(size)
                            ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-500 dark:bg-indigo-900 dark:text-indigo-200"
                            : "bg-slate-100 text-slate-700 border-2 border-transparent dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  className="px-5 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 font-medium rounded-lg transition-colors"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                  onClick={saveUpdatedProduct}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default List;
