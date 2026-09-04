import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserRound,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/bookings.css";

const Bookings = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await api.get("/bookings/my");

      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error(
        "FETCH BOOKINGS ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to load bookings",
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
  // CANCEL BOOKING
  // ==========================================

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await api.put(`/bookings/${id}/cancel`);

      showToast(
        "Booking cancelled successfully",
        "success"
      );

      await fetchBookings();
    } catch (err) {
      console.error(
        "CANCEL BOOKING ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to cancel booking",
        "error"
      );
    }
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
    if (!date) return "Not scheduled";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================================
  // STATUS TEXT
  // ==========================================

  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Pending";

      case "Confirmed":
        return "Confirmed";

      case "Technician Assigned":
        return "Technician Assigned";

      case "Accepted":
        return "Accepted";

      case "In Progress":
        return "In Progress";

      case "Completed":
        return "Completed";

      case "Paid":
        return "Paid";

      case "Cancelled":
        return "Cancelled";

      default:
        return status || "Pending";
    }
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
  // RENDER
  // ==========================================

  return (
    <div className="bookings-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="bookings-header">

        <div className="bookings-header-content">

          <span className="bookings-label">
            CUSTOMER BOOKINGS
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            Track and manage all your service bookings.
          </p>

        </div>

        <button
          type="button"
          className="bookings-back-btn"
          onClick={() =>
            navigate("/customer/dashboard")
          }
        >
          <ArrowLeft size={15} />
          Dashboard
        </button>

      </div>

      {/* ======================================
          LOADING
      ====================================== */}

      {loading && (
        <div className="bookings-loading">

          <Loader2
            size={34}
            className="booking-loading-icon"
          />

          <p>
            Loading your bookings...
          </p>

        </div>
      )}

      {/* ======================================
          EMPTY
      ====================================== */}

      {!loading &&
        bookings.length === 0 && (
          <div className="bookings-empty">

            <div className="bookings-empty-icon">
              <CalendarDays size={28} />
            </div>

            <h2>
              No Bookings Yet
            </h2>

            <p>
              You haven't booked any services yet.
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
        )}

      {/* ======================================
          BOOKINGS
      ====================================== */}

      {!loading &&
        bookings.length > 0 && (
          <div className="bookings-list">

            {bookings.map((booking) => {

              const status = String(
                booking.status || "Pending"
              ).toLowerCase();

              const isCancelled =
                status === "cancelled";

              const isPaid =
                status === "paid";

              const isCompleted =
                status === "completed";

              const isInProgress =
                status === "in-progress";

              const isAccepted =
                status === "accepted";

              const isAssigned =
                status === "technician-assigned";

              return (
                <div
                  className="booking-item"
                  key={booking._id}
                >

                  {/* =================================
                      MAIN SERVICE
                  ================================= */}

                  <div className="booking-main">

                    <div className="booking-icon">
                      <Wrench size={21} />
                    </div>

                    <div className="booking-details">

                      <span className="booking-service-label">
                        SERVICE
                      </span>

                      <h2>
                        {booking.service?.name ||
                          "Service"}
                      </h2>

                      <p>
                        {booking.service?.description ||
                          "Professional service"}
                      </p>

                    </div>

                  </div>

                  {/* =================================
                      INFORMATION
                  ================================= */}

                  <div className="booking-info-grid">

                    {/* DATE */}

                    <div className="booking-info-box">

                      <span>
                        DATE & TIME
                      </span>

                      <strong className="info-value">

                        <CalendarDays size={14} />

                        {formatDate(
                          booking.bookingDate
                        )}

                      </strong>

                    </div>

                    {/* ADDRESS */}

                    <div className="booking-info-box">

                      <span>
                        ADDRESS
                      </span>

                      <strong className="info-value">

                        <MapPin size={14} />

                        {booking.address ||
                          "Address not available"}

                      </strong>

                    </div>

                    {/* PRICE */}

                    <div className="booking-info-box">

                      <span>
                        PRICE
                      </span>

                      <strong className="booking-price">

                        ₹
                        {Number(
                          booking.service?.price || 0
                        ).toLocaleString("en-IN")}

                      </strong>

                    </div>

                  </div>

                  {/* =================================
                      FOOTER
                  ================================= */}

                  <div className="booking-footer">

                    {/* STATUS */}

                    <span
                      className={`booking-status ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {getStatusText(
                        booking.status
                      )}
                    </span>

                    {/* ACTIONS */}

                    <div className="booking-actions">

                      {/* CANCEL */}

                      {!isCancelled &&
                        !isCompleted &&
                        !isPaid &&
                        !isInProgress && (
                          <button
                            type="button"
                            className="cancel-booking-btn"
                            onClick={() =>
                              handleCancel(
                                booking._id
                              )
                            }
                          >
                            <AlertCircle size={14} />
                            Cancel Booking
                          </button>
                        )}

                      {/* PAY NOW */}

                      {isCompleted &&
                        !isPaid && (
                          <button
                            type="button"
                            className="pay-booking-btn"
                            onClick={() =>
                              handlePayment(
                                booking
                              )
                            }
                          >
                            <CreditCard size={14} />
                            Pay Now
                            <ArrowRight size={14} />
                          </button>
                        )}

                      {/* PAID */}

                      {isPaid && (
                        <span className="paid-booking-badge">
                          <CheckCircle2 size={14} />
                          Payment Completed
                        </span>
                      )}

                      {/* IN PROGRESS */}

                      {isInProgress && (
                        <span className="service-progress-text">
                          <Wrench size={14} />
                          Service in progress
                        </span>
                      )}

                      {/* ACCEPTED */}

                      {isAccepted && (
                        <span className="service-progress-text accepted">
                          <UserRound size={14} />
                          Technician accepted
                        </span>
                      )}

                      {/* ASSIGNED */}

                      {isAssigned && (
                        <span className="service-progress-text assigned">
                          <UserRound size={14} />
                          Technician assigned
                        </span>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}
    </div>
  );
};

export default Bookings;
