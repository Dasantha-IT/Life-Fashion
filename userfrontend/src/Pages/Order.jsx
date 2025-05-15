import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext.jsx";
import Title from "../Components/Title";
import axios from "axios";
import { toast } from "react-toastify";

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [addressData, setAddressData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            item["orderId"] = order._id;
            // Add address information to each item
            item["address"] = order.address;
            allOrdersItem.push(item);
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log("Error loading orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const openEditModal = (orderId, address) => {
    setSelectedOrderId(orderId);
    // Populate form with current address data
    setAddressData({
      firstName: address?.firstName || "",
      lastName: address?.lastName || "",
      email: address?.email || "",
      street: address?.street || "",
      city: address?.city || "",
      state: address?.state || "",
      zipcode: address?.zipcode || "",
      country: address?.country || "",
      phone: address?.phone || "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedOrderId(null);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const updateAddress = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${backendUrl}/api/order/update/${selectedOrderId}`,
        { address: addressData },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Address updated successfully");
        closeEditModal();
        loadOrderData(); // Reload orders to reflect changes
      } else {
        toast.error(response.data.message || "Failed to update address");
      }
    } catch (error) {
      console.log("Error updating address:", error);
      toast.error("Error updating address");
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2x1">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex item-center gap-3 mt-1 text-base text-gray-700">
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="mt-1">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Payment:{" "}
                  <span className="text-gray-400">{item.paymentMethod}</span>
                </p>

                {/* Display shipping address summary */}
                <p className="mt-1">
                  Ship to:{" "}
                  <span className="text-gray-400">
                    {item.address?.firstName} {item.address?.lastName},{" "}
                    {item.address?.city}
                  </span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(item.orderId, item.address)}
                  className="border px-4 py-2 text-sm font-medium rounded-sm bg-gray-100"
                >
                  Edit Address
                </button>
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Address Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Delivery Address</h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={updateAddress} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <input
                  required
                  onChange={handleAddressChange}
                  name="firstName"
                  value={addressData.firstName}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="First name"
                />
                <input
                  required
                  onChange={handleAddressChange}
                  name="lastName"
                  value={addressData.lastName}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="Last name"
                />
              </div>

              <input
                required
                onChange={handleAddressChange}
                name="email"
                value={addressData.email}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="email"
                placeholder="Email address"
              />

              <input
                required
                onChange={handleAddressChange}
                name="street"
                value={addressData.street}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="Street"
              />

              <div className="flex gap-3">
                <input
                  required
                  onChange={handleAddressChange}
                  name="city"
                  value={addressData.city}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="City"
                />
                <input
                  onChange={handleAddressChange}
                  name="state"
                  value={addressData.state}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="State"
                />
              </div>

              <div className="flex gap-3">
                <input
                  required
                  onChange={handleAddressChange}
                  name="zipcode"
                  value={addressData.zipcode}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="ZipCode"
                />
                <input
                  required
                  onChange={handleAddressChange}
                  name="country"
                  value={addressData.country}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  placeholder="Country"
                />
              </div>

              <input
                required
                onChange={handleAddressChange}
                name="phone"
                value={addressData.phone}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                placeholder="Phone"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Update Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
