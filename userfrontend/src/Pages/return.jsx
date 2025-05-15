import React, { useEffect, useState } from "react";
import axios from "axios";

const UserReturnPage = () => {
  const [returns, setReturns] = useState([]);
  const [newReturn, setNewReturn] = useState({ orderId: "", reason: "" });
  const [updateReason, setUpdateReason] = useState({});
  const token = localStorage.getItem("token");
  const baseURL = "http://localhost:5000/api/return";

  const fetchReturns = async () => {
    try {
      const res = await axios.get(baseURL + "/", {
        headers: { token },
      });
      setReturns(res.data.returns || []);
    } catch (err) {
      alert("Error fetching returns");
    }
  };

  const handleCreate = async () => {
    try {
      const res = await axios.post(baseURL + "/request", newReturn, {
        headers: { token },
      });
      alert(res.data.message);
      fetchReturns();
      setNewReturn({ orderId: "", reason: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to request return");
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(
        baseURL + "/user/update",
        { returnId: id, reason: updateReason[id] },
        { headers: { token } }
      );
      alert(res.data.message);
      fetchReturns();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(baseURL + `/user/delete/${id}`, {
        headers: { token },
      });
      alert(res.data.message);
      fetchReturns();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Return Requests</h2>

      {/* New Return Form */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Order ID"
          value={newReturn.orderId}
          onChange={(e) =>
            setNewReturn({ ...newReturn, orderId: e.target.value })
          }
          className="border px-2 py-1 mr-2"
        />
        <input
          type="text"
          placeholder="Reason"
          value={newReturn.reason}
          onChange={(e) =>
            setNewReturn({ ...newReturn, reason: e.target.value })
          }
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-1"
        >
          Submit
        </button>
      </div>

      {/* Return List */}
      {returns.length === 0 ? (
        <p className="text-gray-500">No return requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {returns.map((r) => (
            <li key={r._id} className="border p-3 rounded bg-white shadow-sm">
              <p>
                <strong>Order ID:</strong> {r.orderId}
              </p>
              <p>
                <strong>Status:</strong> {r.status}
              </p>
              <p>
                <strong>Reason:</strong>{" "}
                {r.status === "Pending" ? (
                  <input
                    type="text"
                    value={updateReason[r._id] || r.reason}
                    onChange={(e) =>
                      setUpdateReason((prev) => ({
                        ...prev,
                        [r._id]: e.target.value,
                      }))
                    }
                    className="border px-2 py-1"
                  />
                ) : (
                  r.reason
                )}
              </p>
              {r.status === "Pending" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleUpdate(r._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserReturnPage;
