import { useEffect, useState } from "react";
import {
  Check,
  Play,
  CheckCircle2,
  Clock3,
  CreditCard,
  UserRoundPlus,
  XCircle,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/adminBookings.css";

const statusOptions = [
  "Pending",
  "Confirmed",
  "Technician Assigned",
  "Accepted",
  "In Progress",
  "Completed",
  "Paid",
  "Cancelled",
];

const Bookings = () => {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [loading, setLoading] = useState(true);
  const [technicianLoading, setTechnicianLoading] =
    useState(true);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [selectedTechnicians, setSelectedTechnicians] =
    useState({});

  const [assigningId, setAssigningId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      const res = await api.get("/bookings", {
        params,
      });

      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(
        "FETCH BOOKINGS ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to fetch bookings",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH TECHNICIANS
  // ==========================================

  const fetchTechnicians = async () => {
    try {
      setTechnicianLoading(true);

      const res = await api.get("/technicians");

      setTechnicians(
        res.data.technicians || []
      );
    } catch (err) {
      console.error(
        "FETCH TECHNICIANS ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to fetch technicians",
        "error"
      );
    } finally {
      setTechnicianLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchTechnicians();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  // ==========================================
  // STATUS UPDATE
  // ==========================================

  const updateStatus = async (
    bookingId,
    newStatus
  ) => {
    try {
      setUpdatingId(bookingId);

      await api.put(
        `/bookings/${bookingId}/status`,
        {
          status: newStatus,
        }
      );

      showToast(
        `Booking moved to "${newStatus}"`,
        "success"
      );

      await fetchBookings();
    } catch (err) {
      console.error(
        "UPDATE STATUS ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to update booking",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // WORKFLOW ACTION
  // ==========================================

  const getWorkflowAction = (booking) => {
    switch (booking.status) {
      case "Pending":
        return {
          label: "Confirm",
          nextStatus: "Confirmed",
          icon: <Check size={15} />,
          className: "workflow-confirm",
        };

      case "Confirmed":
        return {
          label: booking.technician
            ? "Assigned"
            : "Assign Technician",
          nextStatus: null,
          icon: <UserRoundPlus size={15} />,
          className: booking.technician
            ? "workflow-waiting"
            : "workflow-assign",
        };

      case "Technician Assigned":
        return {
          label: "Waiting",
          nextStatus: null,
          icon: <Clock3 size={15} />,
          className: "workflow-waiting",
        };

      case "Accepted":
        return {
          label: "Start Service",
          nextStatus: "In Progress",
          icon: <Play size={15} />,
          className: "workflow-start",
        };

      case "In Progress":
        return {
          label: "Complete",
          nextStatus: "Completed",
          icon: <CheckCircle2 size={15} />,
          className: "workflow-complete",
        };

      case "Completed":
        return {
          label: "Awaiting Payment",
          nextStatus: null,
          icon: <CreditCard size={15} />,
          className: "workflow-payment",
        };

      case "Paid":
        return null;

      case "Cancelled":
        return {
          label: "Cancelled",
          nextStatus: null,
          icon: <XCircle size={15} />,
          className: "workflow-cancelled",
        };

      default:
        return null;
    }
  };

  // ==========================================
  // SELECT TECHNICIAN
  // ==========================================

  const handleTechnicianChange = (
    bookingId,
    technicianId
  ) => {
    setSelectedTechnicians((prev) => ({
      ...prev,
      [bookingId]: technicianId,
    }));
  };

  // ==========================================
  // ASSIGN TECHNICIAN
  // ==========================================

  const assignTechnician = async (bookingId) => {
    const technicianId =
      selectedTechnicians[bookingId];

    if (!technicianId) {
      showToast(
        "Please select a technician first",
        "warning"
      );
      return;
    }

    try {
      setAssigningId(bookingId);

      const res = await api.put(
        `/bookings/${bookingId}/assign`,
        {
          technician: technicianId,
        }
      );

      console.log(
        "ASSIGN TECHNICIAN RESPONSE:",
        res.data
      );

      showToast(
        "Technician assigned successfully",
        "success"
      );

      setSelectedTechnicians((prev) => {
        const updated = { ...prev };

        delete updated[bookingId];

        return updated;
      });

      await fetchBookings();
    } catch (err) {
      console.error(
        "ASSIGN TECHNICIAN ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to assign technician",
        "error"
      );
    } finally {
      setAssigningId(null);
    }
  };

  // ==========================================
  // AVAILABLE TECHNICIANS
  // ==========================================

  const availableTechnicians =
    technicians.filter(
      (technician) =>
        technician.availability === true &&
        technician.status === "Active"
    );

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (value) => {
    return `status-badge status-${String(
      value || ""
    )
      .toLowerCase()
      .replaceAll(" ", "-")}`;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="admin-bookings-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="bookings-header">
        <div>
          <span>ADMIN PANEL</span>

          <h1>Booking Management</h1>

          <p>
            Manage customer bookings and service
            requests.
          </p>
        </div>
      </div>

      {/* ======================================
          FILTERS
      ====================================== */}

      <div className="booking-filters">

        <form
          className="booking-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">
            All Status
          </option>

          {statusOptions.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* ======================================
          BOOKINGS
      ====================================== */}

      <div className="admin-bookings-card">

        <div className="booking-card-heading">
          <div>
            <h2>All Bookings</h2>

            <p>
              {bookings.length} bookings
            </p>
          </div>
        </div>

        {loading ? (
          <div className="booking-loading">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="booking-empty">

            <h3>
              No Bookings Found
            </h3>

            <p>
              There are no bookings matching
              your filters.
            </p>

          </div>
        ) : (
          <div className="booking-table-wrapper">

            <table className="booking-table">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date</th>
                  <th>Address</th>
                  <th>Technician</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {bookings.map((booking) => {

                  const workflowAction =
                    getWorkflowAction(booking);

                  return (
                    <tr key={booking._id}>

                      {/* CUSTOMER */}

                      <td>
                        <div className="customer-info">

                          <div className="customer-avatar">
                            {booking.user?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}
                          </div>

                          <div>
                            <strong>
                              {booking.user?.name ||
                                "Unknown"}
                            </strong>

                            <small>
                              {booking.user?.email ||
                                "-"}
                            </small>
                          </div>

                        </div>
                      </td>

                      {/* SERVICE */}

                      <td>
                        <strong>
                          {booking.service?.name ||
                            "Unknown Service"}
                        </strong>

                        <small className="service-category">
                          {booking.service?.category ||
                            "-"}
                        </small>
                      </td>

                      {/* DATE */}

                      <td>
                        {booking.bookingDate
                          ? new Date(
                              booking.bookingDate
                            ).toLocaleString()
                          : "-"}
                      </td>

                      {/* ADDRESS */}

                      <td>
                        <div className="address-text">
                          {booking.address || "-"}
                        </div>
                      </td>

                      {/* TECHNICIAN */}

                      <td>

                        {booking.technician ? (

                          <div className="assigned-technician">

                            <div className="technician-mini-avatar">
                              {booking
                                .technician
                                .name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "T"}
                            </div>

                            <div>
                              <strong>
                                {
                                  booking
                                    .technician
                                    .name
                                }
                              </strong>

                              <small>
                                {
                                  booking
                                    .technician
                                    .specialization
                                }
                              </small>
                            </div>

                          </div>

                        ) : (

                          <div className="assign-box">

                            <select
                              value={
                                selectedTechnicians[
                                  booking._id
                                ] || ""
                              }
                              onChange={(e) =>
                                handleTechnicianChange(
                                  booking._id,
                                  e.target.value
                                )
                              }
                              disabled={
                                technicianLoading ||
                                assigningId ===
                                  booking._id
                              }
                            >
                              <option value="">
                                {technicianLoading
                                  ? "Loading..."
                                  : "Select Technician"}
                              </option>

                              {availableTechnicians.map(
                                (technician) => (
                                  <option
                                    key={
                                      technician._id
                                    }
                                    value={
                                      technician._id
                                    }
                                  >
                                    {technician.name} —{" "}
                                    {
                                      technician
                                        .specialization
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            <button
                              type="button"
                              className="assign-btn"
                              onClick={() =>
                                assignTechnician(
                                  booking._id
                                )
                              }
                              disabled={
                                assigningId ===
                                  booking._id ||
                                !selectedTechnicians[
                                  booking._id
                                ]
                              }
                            >
                              {assigningId ===
                              booking._id
                                ? "Assigning..."
                                : "Assign"}
                            </button>

                          </div>
                        )}

                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={getStatusClass(
                            booking.status
                          )}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* WORKFLOW ACTION */}

                      <td>

                        {workflowAction ? (

                          <button
                            type="button"
                            className={`workflow-action-btn ${workflowAction.className}`}
                            disabled={
                              updatingId ===
                                booking._id ||
                              workflowAction.nextStatus ===
                                null
                            }
                            onClick={() => {

                              if (
                                workflowAction.nextStatus
                              ) {
                                updateStatus(
                                  booking._id,
                                  workflowAction.nextStatus
                                );
                              }

                            }}
                          >

                            {updatingId ===
                            booking._id ? (
                              "Updating..."
                            ) : (
                              <>
                                {
                                  workflowAction.icon
                                }

                                {
                                  workflowAction.label
                                }
                              </>
                            )}

                          </button>

                        ) : (
                          <span className="no-action">
                            —
                          </span>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
};

export default Bookings;
