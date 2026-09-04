import { useEffect, useState } from "react";
import {
  CreditCard,
  RefreshCw,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/adminPayment.css";

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

      const res = await api.get("/payments");

      setPayments(res.data.payments || []);
    } catch (err) {
      console.error(
        "FETCH PAYMENTS ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to fetch payments",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="admin-payments-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="payments-header">
        <div>
          <span>ADMIN PANEL</span>

          <h1>
            Payment Management
          </h1>

          <p>
            View and manage customer payments.
          </p>
        </div>
      </div>

      {/* ======================================
          PAYMENTS CARD
      ====================================== */}

      <div className="payments-card">

        <div className="payments-card-header">

          <div>
            <h2>
              All Payments
            </h2>

            <p>
              {payments.length} payments
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPayments}
            disabled={loading}
            className="payments-refresh-btn"
          >
            <RefreshCw
              size={15}
              className={
                loading ? "refresh-spin" : ""
              }
            />

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* ====================================
            LOADING
        ==================================== */}

        {loading ? (

          <div className="payment-loading">
            Loading payments...
          </div>

        ) : payments.length === 0 ? (

          /* ==================================
             EMPTY
          ================================== */

          <div className="payment-empty">

            <div className="payment-empty-icon">
              <CreditCard size={25} />
            </div>

            <h3>
              No Payments Found
            </h3>

            <p>
              Customer payments will appear here.
            </p>

          </div>

        ) : (

          /* ==================================
             TABLE
          ================================== */

          <div className="payment-table-wrapper">

            <table className="payment-table">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {payments.map((payment) => (

                  <tr key={payment._id}>

                    {/* CUSTOMER */}

                    <td>
                      <div className="payment-customer">

                        <div className="payment-avatar">
                          {payment.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </div>

                        <div>
                          <strong>
                            {payment.user?.name ||
                              "Unknown"}
                          </strong>

                          <small>
                            {payment.user?.email ||
                              "-"}
                          </small>
                        </div>

                      </div>
                    </td>

                    {/* SERVICE */}

                    <td>
                      {payment.booking?.service?.name ||
                        "Service"}
                    </td>

                    {/* AMOUNT */}

                    <td>
                      <strong className="payment-amount">
                        ₹
                        {Number(
                          payment.amount || 0
                        ).toLocaleString("en-IN")}
                      </strong>
                    </td>

                    {/* METHOD */}

                    <td>
                      <span className="payment-method">
                        {payment.paymentMethod ||
                          "-"}
                      </span>
                    </td>

                    {/* TRANSACTION ID */}

                    <td>
                      <small>
                        {payment.transactionId ||
                          "-"}
                      </small>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`payment-status ${
                          payment.status
                            ?.toLowerCase()
                            .replaceAll(
                              " ",
                              "-"
                            ) || ""
                        }`}
                      >
                        {payment.status || "-"}
                      </span>
                    </td>

                    {/* DATE */}

                    <td>
                      {payment.createdAt
                        ? new Date(
                            payment.createdAt
                          ).toLocaleString()
                        : "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default Payments;
