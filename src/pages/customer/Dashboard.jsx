import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Wrench,
  CheckCircle2,
  CreditCard,
  Plus,
  RefreshCw,
  ArrowRight,
  MapPin,
  Loader2,
  AlertCircle,
  UserRound,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/bookings/my");

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error(
        "FETCH CUSTOMER BOOKINGS ERROR:",
        error.response?.data || error.message
      );

      showToast(
        error.response?.data?.message ||
          "Unable to load your bookings",
        "error"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==========================================
  // STATS
  // ==========================================

  const pending = bookings.filter(
    (booking) =>
      booking.status === "Pending" ||
      booking.status === "pending"
  ).length;

  const completed = bookings.filter(
    (booking) =>
      booking.status === "Completed" ||
      booking.status === "completed"
  ).length;

  const inProgress = bookings.filter(
    (booking) =>
      booking.status === "In Progress" ||
      booking.status === "in progress"
  ).length;

  const paid = bookings.filter(
    (booking) =>
      booking.status === "Paid" ||
      booking.status === "paid"
  ).length;

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // ==========================================
  // PAYMENT
  // ==========================================

  const handlePayment = (booking) => {
    navigate("/customer/payment", {
      state: {
        booking,
      },
    });
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="customer-dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div className="dashboard-header-content">

          <p className="dashboard-label">
            CUSTOMER DASHBOARD
          </p>

          <h1>
            Welcome Back
          </h1>

          <p className="dashboard-subtitle">
            Manage your services and bookings easily.
          </p>

        </div>

        <div className="dashboard-header-actions">

          <button
            type="button"
            className="customer-refresh-btn"
            onClick={() =>
              fetchBookings(true)
            }
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <Loader2
                  size={15}
                  className="spin-icon"
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

          <button
            type="button"
            className="book-service-btn"
            onClick={() =>
              navigate("/customer/services")
            }
          >
            <Plus size={16} />
            Book Service
          </button>

        </div>

      </div>

      {/* ======================================
          STATS
      ====================================== */}

      <div className="dashboard-stats">

        {/* TOTAL */}

        <div className="stat-card">

          <div className="stat-icon">
            <CalendarDays size={21} />
          </div>

          <div className="stat-content">
            <span>Total Bookings</span>
            <h2>{bookings.length}</h2>
          </div>

        </div>

        {/* PENDING */}

        <div className="stat-card">

          <div className="stat-icon">
            <Clock3 size={21} />
          </div>

          <div className="stat-content">
            <span>Pending</span>
            <h2>{pending}</h2>
          </div>

        </div>

        {/* IN PROGRESS */}

        <div className="stat-card">

          <div className="stat-icon">
            <Wrench size={21} />
          </div>

          <div className="stat-content">
            <span>In Progress</span>
            <h2>{inProgress}</h2>
          </div>

        </div>

        {/* COMPLETED */}

        <div className="stat-card">

          <div className="stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div className="stat-content">
            <span>Completed</span>
            <h2>{completed}</h2>
          </div>

        </div>

        {/* PAID */}

        <div className="stat-card">

          <div className="stat-icon">
            <CreditCard size={21} />
          </div>

          <div className="stat-content">
            <span>Paid</span>
            <h2>{paid}</h2>
          </div>

        </div>

      </div>

      {/* ======================================
          RECENT BOOKINGS
      ====================================== */}

      <div className="recent-section">

        <div className="section-header">

          <div>

            <span className="section-label">
              ACTIVITY
            </span>

            <h2>
              Recent Bookings
            </h2>

            <p>
              Your latest service bookings
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/customer/bookings")
            }
          >
            View All
            <ArrowRight size={14} />
          </button>

        </div>

        {/* ==================================
            LOADING
        ================================== */}

        {loading ? (

          <div className="dashboard-loading">

            <div className="dashboard-spinner"></div>

            <p>
              Loading bookings...
            </p>

          </div>

        ) : bookings.length === 0 ? (

          /* ==================================
             EMPTY
          ================================== */

          <div className="empty-bookings">

            <div className="empty-icon">
              <CalendarDays size={25} />
            </div>

            <h3>
              No bookings yet
            </h3>

            <p>
              Book your first service and it will
              appear here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/customer/services")
              }
            >
              <Wrench size={15} />
              Explore Services
              <ArrowRight size={14} />
            </button>

          </div>

        ) : (

          /* ==================================
             BOOKING LIST
          ================================== */

          <div className="booking-list">

            {bookings
              .slice(0, 5)
              .map((booking) => {

                const isCompleted =
                  booking.status === "Completed" ||
                  booking.status === "completed";

                const isPaid =
                  booking.status === "Paid" ||
                  booking.status === "paid";

                const isCancelled =
                  booking.status === "Cancelled" ||
                  booking.status === "cancelled";

                const isInProgress =
                  booking.status === "In Progress";

                const isAssigned =
                  booking.status ===
                  "Technician Assigned";

                const isAccepted =
                  booking.status === "Accepted";

                return (
                  <div
                    className="booking-card"
                    key={booking._id}
                  >

                    {/* BOOKING INFO */}

                    <div className="booking-info">

                      <div className="booking-service-icon">
                        <Wrench size={19} />
                      </div>

                      <div className="booking-details">

                        <h3>
                          {booking.service?.name ||
                            "Service"}
                        </h3>

                        <p className="booking-date">

                          <CalendarDays size={13} />

                          {formatDate(
                            booking.bookingDate
                          )}

                        </p>

                        {booking.address && (
                          <small className="booking-address">

                            <MapPin size={12} />

                            {booking.address}

                          </small>
                        )}

                      </div>

                    </div>

                    {/* BOOKING META */}

                    <div className="booking-meta">

                      <span
                        className={`status-badge ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status ||
                          "Pending"}
                      </span>

                      <strong className="booking-price">

                        ₹
                        {Number(
                          booking.service?.price || 0
                        ).toLocaleString("en-IN")}

                      </strong>

                      {/* PAY NOW */}

                      {isCompleted &&
                        !isPaid &&
                        !isCancelled && (
                          <button
                            type="button"
                            className="pay-now-btn"
                            onClick={() =>
                              handlePayment(
                                booking
                              )
                            }
                          >
                            <CreditCard size={14} />
                            Pay Now
                          </button>
                        )}

                      {/* PAID */}

                      {isPaid && (
                        <span className="paid-badge">
                          <CheckCircle2 size={13} />
                          Paid
                        </span>
                      )}

                      {/* IN PROGRESS */}

                      {isInProgress && (
                        <span className="progress-badge">
                          <Wrench size={13} />
                          Service Running
                        </span>
                      )}

                      {/* TECHNICIAN ASSIGNED */}

                      {isAssigned && (
                        <span className="assigned-badge">
                          <UserRound size={13} />
                          Technician Assigned
                        </span>
                      )}

                      {/* ACCEPTED */}

                      {isAccepted && (
                        <span className="accepted-badge">
                          <CheckCircle2 size={13} />
                          Technician Accepted
                        </span>
                      )}

                      {/* CANCELLED */}

                      {isCancelled && (
                        <span className="cancelled-badge">
                          <AlertCircle size={13} />
                          Cancelled
                        </span>
                      )}

                    </div>

                  </div>
                );
              })}

          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;
