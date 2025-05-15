import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  Package,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const UserReturnPage = () => {
  const [returns, setReturns] = useState([]);
  const [newReturn, setNewReturn] = useState({ orderId: "", reason: "" });
  const [updateReason, setUpdateReason] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);
  const token = localStorage.getItem("token");
  const baseURL = "http://localhost:5000/api/return";

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(baseURL + "/user", {
        headers: { token },
      });
      setReturns(res.data.returns || []);
    } catch (err) {
      toast("Error fetching returns", "error");
    } finally {
      setLoading(false);
    }
  };

  const toast = (message, type = "success") => {
    // This could be replaced with a proper toast library
    alert(message);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newReturn.orderId || !newReturn.reason) {
      toast("Please fill in all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(baseURL + "/request", newReturn, {
        headers: { token },
      });
      toast(res.data.message, "success");
      fetchReturns();
      setNewReturn({ orderId: "", reason: "" });
    } catch (err) {
      toast(err.response?.data?.message || "Failed to request return", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!updateReason[id]) {
      toast("Reason cannot be empty", "error");
      return;
    }

    setActionInProgress(id + "-update");
    try {
      const res = await axios.put(
        baseURL + "/user/update",
        { returnId: id, reason: updateReason[id] },
        { headers: { token } }
      );
      toast(res.data.message, "success");
      fetchReturns();
    } catch (err) {
      toast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this return request?")) {
      return;
    }

    setActionInProgress(id + "-delete");
    try {
      const res = await axios.delete(baseURL + `/user/delete/${id}`, {
        headers: { token },
      });
      toast(res.data.message, "success");
      fetchReturns();
    } catch (err) {
      toast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setActionInProgress(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "Approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "Refunded":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
            Pending
          </span>
        );
      case "Approved":
        return (
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
            Rejected
          </span>
        );
      case "Refunded":
        return (
          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
            Refunded
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Return Requests</h1>
        <button
          onClick={fetchReturns}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* New Return Form */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <PlusCircle className="w-5 h-5 mr-2 text-blue-600" />
          Create New Return Request
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                placeholder="Enter your order ID"
                value={newReturn.orderId}
                onChange={(e) =>
                  setNewReturn({ ...newReturn, orderId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Return
              </label>
              <input
                type="text"
                placeholder="Why are you returning this item?"
                value={newReturn.reason}
                onChange={(e) =>
                  setNewReturn({ ...newReturn, reason: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                ${submitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Submit Return Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Return List */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-600" />
          Return History
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : returns.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600">
              No return requests yet
            </h3>
            <p className="text-gray-500 mt-1">
              Your return requests will appear here once created
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((r) => (
              <div
                key={r._id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(r.status)}
                      <span className="ml-2 text-gray-900 font-medium">
                        Order #{r.orderId}
                      </span>
                    </div>
                    <div>{getStatusBadge(r.status)}</div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">
                      Reason for return:
                    </p>
                    {r.status === "Pending" ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={updateReason[r._id] || r.reason}
                          onChange={(e) =>
                            setUpdateReason((prev) => ({
                              ...prev,
                              [r._id]: e.target.value,
                            }))
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-700">{r.reason}</p>
                    )}
                  </div>

                  {r.status === "Pending" && (
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => handleUpdate(r._id)}
                        disabled={actionInProgress === r._id + "-update"}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                          ${
                            actionInProgress === r._id + "-update"
                              ? "bg-yellow-400"
                              : "bg-yellow-500 hover:bg-yellow-600"
                          } 
                          focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-yellow-500 transition-colors`}
                      >
                        {actionInProgress === r._id + "-update" ? (
                          <>
                            <div className="w-3 h-3 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Edit2 className="w-3 h-3 mr-1" />
                            Update
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={actionInProgress === r._id + "-delete"}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                          ${
                            actionInProgress === r._id + "-delete"
                              ? "bg-red-400"
                              : "bg-red-600 hover:bg-red-700"
                          } 
                          focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 transition-colors`}
                      >
                        {actionInProgress === r._id + "-delete" ? (
                          <>
                            <div className="w-3 h-3 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReturnPage;
