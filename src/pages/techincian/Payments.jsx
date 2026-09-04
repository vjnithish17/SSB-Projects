import { useEffect, useState } from "react";
import {
  CreditCard,
  IndianRupee,
  UserRound,
  Wrench,
  CalendarDays,
  ReceiptText,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/payments.css";

const Payments = () => {
  const { showToast } = useToast();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH PAYMENTS
  // ==========================================

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/payments/technician/my"
      );

      setPayments(res.data.payments || []);
    } catch (err) {
      console.error(
        "TECHNICIAN PAYMENTS ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Failed to fetch payment history",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ==========================================
  // SUMMARY
  // ==========================================

  const totalAmount = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  const paidCount = payments.filter(
    (payment) => payment.status === "Paid"
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status === "Pending"
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
  // STATUS ICON
  // ==========================================

  const getStatusIcon = (status) => {
    if (status === "Paid") {
      return <CheckCircle2 size={15} />;
    }

    if (status === "Pending") {
      return <Clock3 size={15} />;
    }

    return <XCircle size={15} />;
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
    <div className="technician-payments-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="payments-header">

        <div>

          <span className="payments-label">
            TECHNICIAN PAYMENTS
          </span>

          <h1>
            Payment History
          </h1>

          <p>
            Track payments received from your completed
            service bookings.
          </p>

        </div>

        <button
          type="button"
          className="payments-refresh-btn"
          onClick={fetchPayments}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2
                size={15}
                className="payments-spin"
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
          SUMMARY
      ====================================== */}

      <div className="payment-summary-grid">

        {/* TOTAL AMOUNT */}

        <div className="payment-summary-card">

          <div className="payment-summary-icon">
            <IndianRupee size={21} />
          </div>

          <div>
            <span>
              Total Amount
            </span>

            <h2>
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </h2>
          </div>

        </div>

        {/* PAID */}

        <div className="payment-summary-card">

          <div className="payment-summary-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>
              Paid
            </span>

            <h2>
              {paidCount}
            </h2>
          </div>

        </div>

        {/* PENDING */}

        <div className="payment-summary-card">

          <div className="payment-summary-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <span>
              Pending
            </span>

            <h2>
              {pendingCount}
            </h2>
          </div>

        </div>

        {/* TOTAL PAYMENTS */}

        <div className="payment-summary-card">

          <div className="payment-summary-icon">
            <ReceiptText size={21} />
          </div>

          <div>
            <span>
              Total Payments
            </span>

            <h2>
              {payments.length}
            </h2>
          </div>

        </div>

      </div>

      {/* ======================================
          PAYMENT LIST
      ====================================== */}

      <div className="payments-section">

        <div className="payments-section-header">

          <div>

            <span className="section-label">
              PAYMENT RECORDS
            </span>

            <h2>
              My Customer Payments
            </h2>

            <p>
              Payments linked to your assigned service
              bookings.
            </p>

          </div>

          <span className="payment-count">
            {payments.length}{" "}
            {payments.length === 1
              ? "Payment"
              : "Payments"}
          </span>

        </div>

        {/* ==================================
            LOADING
        ================================== */}

        {loading ? (

          <div className="payments-loading">

            <Loader2
              size={34}
              className="payments-loading-spin"
            />

            <p>
              Loading payment history...
            </p>

          </div>

        ) : payments.length === 0 ? (

          /* =================================
             EMPTY
          ================================= */

          <div className="payments-empty">

            <div className="payments-empty-icon">
              <CreditCard size={28} />
            </div>

            <h3>
              No Payment Records
            </h3>

            <p>
              Customer payments for your completed
              bookings will appear here.
            </p>

          </div>

        ) : (

          /* =================================
             PAYMENT CARDS
          ================================= */

          <div className="payments-list">

            {payments.map((payment) => {

              const booking =
                payment.booking;

              const service =
                booking?.service;

              const customer =
                payment.user;

              return (
                <div
                  className="payment-card"
                  key={payment._id}
                >

                  {/* TOP */}

                  <div className="payment-card-top">

                    <div className="payment-main-info">

                      <div className="payment-card-icon">
                        <CreditCard size={20} />
                      </div>

                      <div>

                        <span className="payment-small-label">
                          TRANSACTION
                        </span>

                        <h3>
                          {payment.transactionId ||
                            "Payment"}
                        </h3>

                        <p>
                          {service?.name ||
                            "Service"}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`payment-status ${getStatusClass(
                        payment.status
                      )}`}
                    >

                      {getStatusIcon(
                        payment.status
                      )}

                      {payment.status ||
                        "Pending"}

                    </span>

                  </div>

                  {/* DETAILS */}

                  <div className="payment-details-grid">

                    {/* CUSTOMER */}

                    <div className="payment-detail">

                      <span>
                        CUSTOMER
                      </span>

                      <strong>
                        <UserRound size={14} />

                        {customer?.name ||
                          "Unknown Customer"}
                      </strong>

                      <small>
                        {customer?.email ||
                          "-"}
                      </small>

                    </div>

                    {/* SERVICE */}

                    <div className="payment-detail">

                      <span>
                        SERVICE
                      </span>

                      <strong>
                        <Wrench size={14} />

                        {service?.name ||
                          "Service"}
                      </strong>

                      <small>
                        {service?.category ||
                          "Service"}
                      </small>

                    </div>

                    {/* BOOKING DATE */}

                    <div className="payment-detail">

                      <span>
                        BOOKING DATE
                      </span>

                      <strong>
                        <CalendarDays size={14} />

                        {formatDate(
                          booking?.bookingDate
                        )}
                      </strong>

                    </div>

                    {/* PAYMENT METHOD */}

                    <div className="payment-detail">

                      <span>
                        PAYMENT METHOD
                      </span>

                      <strong>
                        <CreditCard size={14} />

                        {payment.paymentMethod ||
                          "-"}
                      </strong>

                    </div>

                    {/* PAYMENT DATE */}

                    <div className="payment-detail">

                      <span>
                        PAYMENT DATE
                      </span>

                      <strong>
                        <CalendarDays size={14} />

                        {formatDate(
                          payment.createdAt
                        )}
                      </strong>

                    </div>

                    {/* AMOUNT */}

                    <div className="payment-detail amount-detail">

                      <span>
                        AMOUNT
                      </span>

                      <strong>
                        <IndianRupee size={14} />

                        {Number(
                          payment.amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

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

export default Payments;
