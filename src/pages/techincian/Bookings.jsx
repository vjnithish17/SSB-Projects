import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  UserRound,
  MapPin,
  Wrench,
  IndianRupee,
  RefreshCw,
  Loader2,
  Check,
  X,
  Play,
  CheckCircle2,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/bookings.css";

const Bookings = () => {
  const { showToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/bookings/technician/my"
      );

      const activeBookings = (
        res.data.bookings || []
      ).filter((booking) =>
        [
          "Technician Assigned",
          "Accepted",
          "In Progress",
        ].includes(booking.status)
      );

      setBookings(activeBookings);
    } catch (err) {
      console.error(
        "TECHNICIAN BOOKINGS ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Failed to fetch bookings",
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
  // ACCEPT / REJECT BOOKING
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

      showToast(
        res.data.message ||
          `Booking ${action.toLowerCase()}ed successfully`,
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

      const message =
        status === "In Progress"
          ? "Service started successfully"
          : "Service completed successfully";

      showToast(
        res.data.message || message,
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

  const getStatusClass = (status) =>
    String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");

  return (
    <div className="technician-my-bookings">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="my-bookings-header">

        <div>

          <span className="my-bookings-label">
            TECHNICIAN WORK
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            Manage your currently assigned service
            bookings.
          </p>

        </div>

        <button
          type="button"
          className="my-bookings-refresh"
          onClick={fetchBookings}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2
                size={15}
                className="booking-spin"
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
          CONTENT
      ====================================== */}

      <div className="my-bookings-section">

        <div className="my-bookings-section-head">

          <div>
            <span>
              ACTIVE WORK
            </span>

            <h2>
              Current Service Bookings
            </h2>
          </div>

          <strong>
            {bookings.length}{" "}
            {bookings.length === 1
              ? "Booking"
              : "Bookings"}
          </strong>

        </div>

        {/* ==================================
            LOADING
        ================================== */}

        {loading ? (

          <div className="my-bookings-loading">

            <Loader2
              size={34}
              className="booking-loading-spin"
            />

            <p>
              Loading your bookings...
            </p>

          </div>

        ) : bookings.length === 0 ? (

          /* =================================
             EMPTY
          ================================= */

          <div className="my-bookings-empty">

            <div className="my-bookings-empty-icon">
              <CalendarDays size={28} />
            </div>

            <h3>
              No Active Bookings
            </h3>

            <p>
              New bookings assigned by the admin
              will appear here.
            </p>

          </div>

        ) : (

          /* =================================
             BOOKINGS
          ================================= */

          <div className="my-bookings-list">

            {bookings.map((booking) => (

              <div
                className="my-booking-card"
                key={booking._id}
              >

                {/* ============================
                    TOP
                ============================ */}

                <div className="my-booking-top">

                  <div className="my-booking-service">

                    <div className="my-booking-icon">
                      <Wrench size={20} />
                    </div>

                    <div>

                      <span>
                        SERVICE
                      </span>

                      <h3>
                        {booking.service?.name ||
                          "Service"}
                      </h3>

                      <p>
                        {booking.service?.category ||
                          "Service"}
                      </p>

                    </div>

                  </div>

                  <span
                    className={`my-booking-status ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                </div>

                {/* ============================
                    DETAILS
                ============================ */}

                <div className="my-booking-details">

                  <div>

                    <span>
                      DATE & TIME
                    </span>

                    <strong>
                      <CalendarDays size={14} />

                      {formatDate(
                        booking.bookingDate
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      CUSTOMER
                    </span>

                    <strong>
                      <UserRound size={14} />

                      {booking.user?.name ||
                        "Unknown"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      ADDRESS
                    </span>

                    <strong>
                      <MapPin size={14} />

                      {booking.address || "-"}
                    </strong>

                  </div>

                  <div>

                    <span>
                      AMOUNT
                    </span>

                    <strong className="booking-amount">

                      <IndianRupee size={14} />

                      {Number(
                        booking.service?.price || 0
                      ).toLocaleString("en-IN")}

                    </strong>

                  </div>

                </div>

                {/* ============================
                    NOTES
                ============================ */}

                {booking.notes && (
                  <div className="my-booking-notes">

                    <span>
                      Customer Notes
                    </span>

                    <p>
                      {booking.notes}
                    </p>

                  </div>
                )}

                {/* ============================
                    ACTIONS
                ============================ */}

                <div className="my-booking-actions">

                  {/* TECHNICIAN ASSIGNED */}

                  {booking.status ===
                    "Technician Assigned" && (
                    <>

                      <button
                        type="button"
                        className="my-accept-btn"
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
                              className="booking-spin"
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
                        className="my-reject-btn"
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

                    </>
                  )}

                  {/* ACCEPTED */}

                  {booking.status ===
                    "Accepted" && (

                    <div className="booking-progress-action">

                      <span className="booking-accepted-text">

                        <CheckCircle2 size={14} />

                        Booking Accepted

                      </span>

                      <button
                        type="button"
                        className="my-start-btn"
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
                              className="booking-spin"
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

                    <div className="booking-progress-action">

                      <span className="booking-progress-text">

                        <Clock3 size={14} />

                        Service In Progress

                      </span>

                      <button
                        type="button"
                        className="my-complete-btn"
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
                              className="booking-spin"
                            />

                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            Complete Service
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

export default Bookings;
