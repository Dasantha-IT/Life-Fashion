import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  DollarSign,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminReturnPage = () => {
  const [returns, setReturns] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(null);
  const token = localStorage.getItem("token");
  const baseURL = "http://localhost:5000/api/return";

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(baseURL + "/", {
        headers: { token },
      });
      setReturns(res.data.returns || []);
    } catch (err) {
      toast("Error fetching return requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const toast = (message, type = "success") => {
    // This could be replaced with a proper toast library
    alert(message);
  };

  const handleStatusUpdate = async (returnId) => {
    const status = statuses[returnId];
    setIsUpdating(returnId);
    try {
      const res = await axios.put(
        `${baseURL}/update`,
        { returnId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast(res.data.message, "success");
      fetchReturns();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setIsUpdating(null);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Return Requests", 14, 15);

    const tableRows = returns.map((r, index) => [
      index + 1,
      r.orderId,
      r.userId,
      r.reason,
      r.status,
      new Date(r.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["#", "Order ID", "User ID", "Reason", "Status", "Created At"]],
      body: tableRows,
    });

    doc.save("return_requests.pdf");
  };

  const filteredReturns = returns.filter(
    (r) =>
      r.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "Approved":
        return <Check className="w-4 h-4 text-green-500" />;
      case "Rejected":
        return <X className="w-4 h-4 text-red-500" />;
      case "Refunded":
        return <DollarSign className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Return Management</h1>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search returns..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleDownloadPDF}
            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 transition-colors text-green-700 font-medium"
          >
            Download PDF
          </button>
          <button
            onClick={fetchReturns}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredReturns.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            No return requests found
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "New return requests will appear here"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reason
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Update Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReturns.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {r.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {r.userId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {r.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(r.status)}
                      <span className="ml-2">{getStatusBadge(r.status)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={statuses[r._id] || r.status}
                      onChange={(e) =>
                        setStatuses({ ...statuses, [r._id]: e.target.value })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleStatusUpdate(r._id)}
                      disabled={isUpdating === r._id}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                        ${
                          isUpdating === r._id
                            ? "bg-blue-400"
                            : "bg-blue-600 hover:bg-blue-700"
                        } 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                    >
                      {isUpdating === r._id ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        "Update"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReturnPage;
