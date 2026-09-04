import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import {
  CreditCard,
  Wallet,
  Smartphone,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  CalendarDays,
  Wrench,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { showToast } = useToast();

  const booking = location.state?.booking;

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // NO BOOKING
  // ==========================================

  if (!booking) {
    return (
      <div className="payments-page">

        <div className="payments-empty">

          <div className="payments-empty-icon">
            <CreditCard size={28} />
          </div>

          <h2>
            Payment Details Not Found
          </h2>

          <p>
            Please select a booking and click Pay Now.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/customer/bookings")
            }
          >
            <ArrowLeft size={15} />
            View My Bookings
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAYMENT
  // ==========================================

  const handlePayment = async () => {
    if (!paymentMethod) {
      showToast(
        "Please select a payment method",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/payments", {
        booking: booking._id,
        paymentMethod,
      });

      console.log(
        "PAYMENT SUCCESS:",
        res.data
      );

      // SUCCESS TOAST
      showToast(
        "Payment successful",
        "success"
      );

      // Small delay to show toast
      setTimeout(() => {
        navigate("/customer/dashboard");
      }, 600);

    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error.response?.data || error.message
      );

      showToast(
        error.response?.data?.message ||
          "Payment failed",
        "error"
      );
    } finally {
      setLoading(false);
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
  // PAYMENT METHOD DATA
  // ==========================================

  const paymentMethods = [
    {
      value: "Cash",
      label: "Cash",
      description: "Pay after service",
      icon: Wallet,
    },
    {
      value: "UPI",
      label: "UPI",
      description:
        "Google Pay / PhonePe / UPI",
      icon: Smartphone,
    },
    {
      value: "Card",
      label: "Card",
      description:
        "Credit / Debit Card",
      icon: CreditCard,
    },
  ];

  return (
    <div className="payments-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="payments-header">

        <div>

          <span>
            PAYMENT
          </span>

          <h1>
            Complete Your Payment
          </h1>

          <p>
            Securely complete your service payment.
          </p>

        </div>

      </div>

      {/* ======================================
          PAYMENT CONTAINER
      ====================================== */}

      <div className="payment-container">

        {/* ====================================
            BOOKING DETAILS
        ==================================== */}

        <div className="payment-booking-card">

          <div className="payment-booking-icon">
            <Wrench size={21} />
          </div>

          <div className="payment-booking-info">

            <span>
              SELECTED SERVICE
            </span>

            <h2>
              {booking.service?.name ||
                "Service"}
            </h2>

            <p>
              <CalendarDays size={13} />

              {formatDate(
                booking.bookingDate
              )}
            </p>

          </div>

        </div>

        {/* ====================================
            AMOUNT
        ==================================== */}

        <div className="payment-amount-card">

          <div>

            <span>
              TOTAL AMOUNT
            </span>

            <p>
              Service payment
            </p>

          </div>

          <h2>
            ₹
            {Number(
              booking.service?.price || 0
            ).toLocaleString("en-IN")}
          </h2>

        </div>

        {/* ====================================
            PAYMENT METHOD
        ==================================== */}

        <div className="payment-method-card">

          <div className="payment-section-heading">

            <div>

              <span>
                PAYMENT OPTION
              </span>

              <h2>
                Payment Method
              </h2>

              <p>
                Choose your preferred payment method.
              </p>

            </div>

            <div className="payment-heading-icon">
              <CreditCard size={19} />
            </div>

          </div>

          <div className="payment-methods">

            {paymentMethods.map(
              (method) => {

                const Icon = method.icon;

                const active =
                  paymentMethod ===
                  method.value;

                return (
                  <label
                    key={method.value}
                    className={
                      active
                        ? "payment-method active"
                        : "payment-method"
                    }
                  >

                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={active}
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                      disabled={loading}
                    />

                    <div className="payment-method-icon">
                      <Icon size={19} />
                    </div>

                    <div className="payment-method-content">

                      <strong>
                        {method.label}
                      </strong>

                      <small>
                        {method.description}
                      </small>

                    </div>

                    {active && (
                      <CheckCircle2
                        size={17}
                        className="selected-check"
                      />
                    )}

                  </label>
                );
              }
            )}

          </div>

        </div>

        {/* ====================================
            PAY BUTTON
        ==================================== */}

        <button
          type="button"
          className="confirm-payment-btn"
          onClick={handlePayment}
          disabled={loading}
        >

          {loading ? (
            <>
              <Loader2
                size={17}
                className="payment-spin"
              />

              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard size={17} />

              Pay ₹
              {Number(
                booking.service?.price || 0
              ).toLocaleString("en-IN")}

              <span>→</span>
            </>
          )}

        </button>

        {/* ====================================
            BACK
        ==================================== */}

        <button
          type="button"
          className="back-payment-btn"
          onClick={() =>
            navigate("/customer/bookings")
          }
          disabled={loading}
        >
          <ArrowLeft size={15} />
          Back to Bookings
        </button>

      </div>

    </div>
  );
};

export default Payment;
