import { useEffect, useState } from "react";
import {
  Wrench,
  ClipboardList,
  CheckCircle2,
  Clock3,
  RefreshCw,
  CalendarDays,
  UserRound,
  MapPin,
  IndianRupee,
  Play,
  X,
  Check,
  Loader2,
  CircleCheckBig,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/dashboard.css";

const Dashboard = () => {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ==========================================
  // FETCH ASSIGNED BOOKINGS
  // ==========================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/bookings/technician/my"
      );

      setBookings(
        res.data.bookings || []
      );
    } catch (err) {
      console.error(
        "TECHNICIAN DASHBOARD ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Failed to fetch assigned bookings",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==========================================
  // ACCEPT / REJECT
  // ==========================================

  const handleResponse = async (
    bookingId,
    action
  ) => {
    try {
      setActionLoading(bookingId);

      const res = await api.put(
        `/bookings/${bookingId}/response`,
        {
          action,
        }
      );

      const successMessage =
        action === "Accept"
          ? "Booking accepted successfully"
          : "Booking rejected successfully";

      showToast(
        res.data.message ||
          successMessage,
        "success"
      );

      await fetchBookings();
    } catch (err) {
      console.error(
        "BOOKING RESPONSE ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Failed to update booking",
        "error"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // START / COMPLETE SERVICE
  // ==========================================

  const updateServiceStatus = async (
    bookingId,
    status
  ) => {
    try {
      setActionLoading(bookingId);

      const res = await api.put(
        `/bookings/${bookingId}/technician-status`,
        {
          status,
        }
      );

      const successMessage =
        status === "In Progress"
          ? "Service started successfully"
          : "Service completed successfully";

      showToast(
        res.data.message ||
          successMessage,
        "success"
      );

      await fetchBookings();
    } catch (err) {
      console.error(
        "SERVICE STATUS ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Failed to update service status",
        "error"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const assigned = bookings.filter(
    (booking) =>
      booking.status ===
      "Technician Assigned"
  ).length;

  const accepted = bookings.filter(
    (booking) =>
      booking.status === "Accepted"
  ).length;

  const inProgress = bookings.filter(
    (booking) =>
      booking.status === "In Progress"
  ).length;

  const completed = bookings.filter(
    (booking) =>
      booking.status === "Completed"
  ).length;

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="technician-dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="technician-header">

        <div>

          <span className="technician-label">
            TECHNICIAN DASHBOARD
          </span>

          <h1>
            Welcome Back
          </h1>

          <p>
            Manage your assigned service bookings.
          </p>

        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={fetchBookings}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2
                size={15}
                className="refresh-spin"
              />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw size={15} />
              Refresh
            </>
          )}
        </button>

      </div>

      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="technician-stats">

        {/* ASSIGNED */}

        <div className="technician-stat-card">

          <div className="stat-icon">
            <ClipboardList size={21} />
          </div>

          <div>
            <span>
              Assigned
            </span>

            <h2>
              {assigned}
            </h2>
          </div>

        </div>

        {/* ACCEPTED */}

        <div className="technician-stat-card">

          <div className="stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>
              Accepted
            </span>

            <h2>
              {accepted}
            </h2>
          </div>

        </div>

        {/* IN PROGRESS */}

        <div className="technician-stat-card">

          <div className="stat-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <span>
              In Progress
            </span>

            <h2>
              {inProgress}
            </h2>
          </div>

        </div>

        {/* COMPLETED */}

        <div className="technician-stat-card">

          <div className="stat-icon">
            <CircleCheckBig size={21} />
          </div>

          <div>
            <span>
              Completed
            </span>

            <h2>
              {completed}
            </h2>
          </div>

        </div>

      </div>

      {/* ======================================
          BOOKINGS SECTION
      ====================================== */}

      <div className="technician-bookings-section">

        <div className="section-header">

          <div>

            <span className="section-label">
              ASSIGNED WORK
            </span>

            <h2>
              My Assigned Bookings
            </h2>

            <p>
              Service bookings assigned to you
            </p>

          </div>

          <span className="booking-count">
            {bookings.length}{" "}
            {bookings.length === 1
              ? "Booking"
              : "Bookings"}
          </span>

        </div>

        {/* ==================================
            LOADING
        ================================== */}

        {loading ? (

          <div className="technician-loading">

            <Loader2
              size={34}
              className="dashboard-loading-icon"
            />

            <p>
              Loading assigned bookings...
            </p>

          </div>

        ) : bookings.length === 0 ? (

          /* =================================
             EMPTY
          ================================= */

          <div className="technician-empty">

            <div className="empty-icon">
              <CalendarDays size={27} />
            </div>

            <h3>
              No Assigned Bookings
            </h3>

            <p>
              New bookings assigned by the admin
              will appear here.
            </p>

          </div>

        ) : (

          /* =================================
             BOOKING LIST
          ================================= */

          <div className="technician-booking-list">

            {bookings.map((booking) => (

              <div
                className="technician-booking-card"
                key={booking._id}
              >

                {/* BOOKING HEADER */}

                <div className="booking-top">

                  <div className="technician-booking-main">

                    <div className="service-icon">
                      <Wrench size={20} />
                    </div>

                    <div>

                      <span className="service-label">
                        SERVICE
                      </span>

                      <h3>
                        {booking.service?.name ||
                          "Service"}
                      </h3>

                      <p className="service-category">
                        {booking.service?.category ||
                          "Service"}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`technician-status ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status ||
                      "Pending"}
                  </span>

                </div>

                {/* BOOKING DETAILS */}

                <div className="booking-details-grid">

                  {/* DATE */}

                  <div className="booking-detail">

                    <span>
                      DATE & TIME
                    </span>

                    <strong className="detail-value">

                      <CalendarDays size={13} />

                      {formatDate(
                        booking.bookingDate
                      )}

                    </strong>

                  </div>

                  {/* CUSTOMER */}

                  <div className="booking-detail">

                    <span>
                      CUSTOMER
                    </span>

                    <strong className="detail-value">

                      <UserRound size={13} />

                      {booking.user?.name ||
                        "Unknown Customer"}

                    </strong>

                    <small>
                      {booking.user?.email ||
                        "-"}
                    </small>

                  </div>

                  {/* ADDRESS */}

                  <div className="booking-detail">

                    <span>
                      SERVICE ADDRESS
                    </span>

                    <strong className="detail-value">

                      <MapPin size={13} />

                      {booking.address || "-"}

                    </strong>

                  </div>

                  {/* PRICE */}

                  <div className="booking-detail">

                    <span>
                      AMOUNT
                    </span>

                    <strong className="booking-price">

                      <IndianRupee size={14} />

                      {Number(
                        booking.service?.price ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                  </div>

                </div>

                {/* NOTES */}

                {booking.notes && (
                  <div className="technician-notes">

                    <span>
                      Customer Notes
                    </span>

                    <p>
                      {booking.notes}
                    </p>

                  </div>
                )}

                {/* ACTIONS */}

                <div className="booking-actions">

                  {/* ACCEPT / REJECT */}

                  {booking.status ===
                    "Technician Assigned" && (

                    <div className="response-area">

                      <button
                        type="button"
                        className="accept-btn"
                        onClick={() =>
                          handleResponse(
                            booking._id,
                            "Accept"
                          )
                        }
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                      >

                        {actionLoading ===
                        booking._id ? (
                          <>
                            <Loader2
                              size={14}
                              className="action-spin"
                            />

                            Processing...
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            Accept
                          </>
                        )}

                      </button>

                      <button
                        type="button"
                        className="reject-btn"
                        onClick={() =>
                          handleResponse(
                            booking._id,
                            "Reject"
                          )
                        }
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                      >
                        <X size={14} />
                        Reject
                      </button>

                    </div>
                  )}

                  {/* ACCEPTED */}

                  {booking.status ===
                    "Accepted" && (

                    <div className="service-action-area">

                      <span className="accepted-text">

                        <CheckCircle2 size={14} />

                        Booking Accepted

                      </span>

                      <button
                        type="button"
                        className="start-service-btn"
                        onClick={() =>
                          updateServiceStatus(
                            booking._id,
                            "In Progress"
                          )
                        }
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                      >

                        {actionLoading ===
                        booking._id ? (
                          <>
                            <Loader2
                              size={14}
                              className="action-spin"
                            />

                            Starting...
                          </>
                        ) : (
                          <>
                            <Play size={14} />
                            Start Service
                          </>
                        )}

                      </button>

                    </div>
                  )}

                  {/* IN PROGRESS */}

                  {booking.status ===
                    "In Progress" && (

                    <div className="service-action-area">

                      <span className="progress-text">

                        <Clock3 size={14} />

                        Service In Progress

                      </span>

                      <button
                        type="button"
                        className="complete-service-btn"
                        onClick={() =>
                          updateServiceStatus(
                            booking._id,
                            "Completed"
                          )
                        }
                        disabled={
                          actionLoading ===
                          booking._id
                        }
                      >

                        {actionLoading ===
                        booking._id ? (
                          <>
                            <Loader2
                              size={14}
                              className="action-spin"
                            />

                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2
                              size={14}
                            />

                            Complete Service
                          </>
                        )}

                      </button>

                    </div>
                  )}

                  {/* COMPLETED */}

                  {booking.status ===
                    "Completed" && (

                    <span className="completed-text">

                      <CheckCircle2 size={14} />

                      Service Completed

                    </span>

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

export default Dashboard;
