import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../../App";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import {
  Search,
  RefreshCw,
  Trash2,
  Calendar,
  FileText,
  Download,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Deliveries = ({ token }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const fetchAllDeliveries = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl || "http://localhost:5000 "}/api/deliverys`,
        {
          headers: { token },
        }
      );

      let deliveryData = [];
      if (response.data && Array.isArray(response.data)) {
        deliveryData = response.data;
      } else if (response.data && response.data.deliverys) {
        deliveryData = response.data.deliverys;
      } else if (response.data && response.data.Deliverys) {
        // Match the exact property name from the API response
        deliveryData = response.data.Deliverys;
      } else {
        console.error("Response structure:", response.data);
        toast.error("Failed to parse delivery data");
        return;
      }

      setDeliveries(deliveryData);
      setFilteredDeliveries(deliveryData);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      toast.error(
        error.response?.data?.message || "Failed to load delivery records"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteDelivery = async (deliveryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this delivery record?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${backendUrl || "http://localhost:5000 "}/api/deliverys/${deliveryId}`,
        {
          headers: { token },
        }
      );

      if (response.status === 200) {
        toast.success("Delivery record deleted successfully");
        await fetchAllDeliveries();
      } else {
        toast.error(response.data?.message || "Failed to delete delivery");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting delivery record"
      );
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredDeliveries(deliveries);
      return;
    }

    const filtered = deliveries.filter(
      (delivery) =>
        delivery.firstName.toLowerCase().includes(term) ||
        delivery.lastName.toLowerCase().includes(term) ||
        delivery.email.toLowerCase().includes(term) ||
        delivery.city.toLowerCase().includes(term) ||
        delivery.country.toLowerCase().includes(term) ||
        (delivery.phone && delivery.phone.toString().includes(term))
    );

    setFilteredDeliveries(filtered);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    let sorted = [...filteredDeliveries];

    if (order === "newest") {
      sorted.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    } else if (order === "oldest") {
      sorted.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
    } else if (order === "name") {
      sorted.sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        )
      );
    }

    setFilteredDeliveries(sorted);
  };

  const generatePDF = () => {
    setIsGeneratingPdf(true);

    try {
      // Initialize jsPDF with proper settings
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Add metadata
      doc.setProperties({
        title: "Delivery Records Report",
        creator: "Your App Name",
      });

      // Add title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Delivery Records Report", 40, 40);

      // Add subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 40, 60);

      // Prepare table data
      const headers = [["No.", "Name", "Contact", "Address", "Date"]];

      const body = filteredDeliveries.map((delivery, index) => [
        index + 1,
        `${delivery.firstName} ${delivery.lastName}`,
        `${delivery.email}\n${delivery.phone || "N/A"}`,
        `${delivery.street}, ${delivery.city}\n${delivery.country}`,
        delivery.createdAt
          ? new Date(delivery.createdAt).toLocaleDateString()
          : "N/A",
      ]);

      // Generate table
      autoTable(doc, {
        head: headers,
        body: body,
        startY: 80,
        margin: { left: 40 },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 30 }, // No.
          1: { cellWidth: 80 }, // Name
          2: { cellWidth: 100 }, // Contact
          3: { cellWidth: 150 }, // Address
          4: { cellWidth: 60 }, // Date
        },
        didDrawPage: (data) => {
          // Footer
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 20
          );
        },
      });

      // Save PDF
      doc.save(`deliveries_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    fetchAllDeliveries();
  }, [token]);

  return (
    <div className="delivery-page p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
        <h3 className="text-2xl font-semibold">Delivery Records</h3>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortOrder}
              onChange={(e) => handleSort(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name</option>
            </select>

            <button
              onClick={fetchAllDeliveries}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={generatePDF}
              disabled={isGeneratingPdf || filteredDeliveries.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-blue-300"
              title="Generate PDF Report"
            >
              {isGeneratingPdf ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <FileText size={18} />
              )}
              <span className="hidden sm:inline">Report</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500">
          <RefreshCw size={32} className="animate-spin mb-4" />
          <p>Loading delivery records...</p>
        </div>
      ) : filteredDeliveries.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-2">
            {searchTerm
              ? "No matching delivery records found"
              : "No delivery records available"}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilteredDeliveries(deliveries);
              }}
              className="text-blue-500 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="delivery-list grid gap-4">
          {filteredDeliveries.map((delivery) => (
            <div
              key={delivery._id}
              className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-5 items-start bg-white border border-gray-200 p-5 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="delivery-contact flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 rounded-full">
                    <img
                      className="w-6 h-6"
                      src={assets.parcel_icon}
                      alt="Delivery"
                    />
                  </div>
                  <h4 className="text-base font-medium">
                    {delivery.firstName} {delivery.lastName}
                  </h4>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href={`mailto:${delivery.email}`}
                    className="hover:underline text-blue-600"
                  >
                    {delivery.email}
                  </a>
                </p>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span>{" "}
                  <a
                    href={`tel:${delivery.phone}`}
                    className="hover:underline text-blue-600"
                  >
                    {delivery.phone}
                  </a>
                </p>
              </div>

              <div className="address-info">
                <h5 className="font-medium text-sm text-gray-700 mb-2">
                  Delivery Address
                </h5>
                <p className="text-sm text-gray-600 mb-1">{delivery.street}</p>
                <p className="text-sm text-gray-600 mb-1">
                  {delivery.city}, {delivery.state} {delivery.zipcode}
                </p>
                <p className="text-sm text-gray-600">{delivery.country}</p>

                {delivery.orderId && (
                  <div className="mt-3 flex items-start gap-1">
                    <span className="text-xs font-medium text-gray-500">
                      Order ID:
                    </span>
                    <span className="text-xs break-all">
                      {delivery.orderId}
                    </span>
                  </div>
                )}

                {delivery.createdAt && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {new Date(delivery.createdAt).toLocaleDateString()}
                      {delivery.createdAt &&
                        ` ${new Date(delivery.createdAt).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex md:flex-col justify-end gap-2">
                <button
                  onClick={() => deleteDelivery(delivery._id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition duration-200 text-xs font-medium"
                  title="Delete delivery"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredDeliveries.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredDeliveries.length < deliveries.length && searchTerm && (
              <span>
                Filtered results: {filteredDeliveries.length} of{" "}
                {deliveries.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Download size={14} className="mr-1" />
            <span>Export options:</span>
            <button
              onClick={generatePDF}
              disabled={isGeneratingPdf}
              className="ml-2 text-blue-600 hover:text-blue-800 hover:underline disabled:text-gray-400"
            >
              PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deliveries;
