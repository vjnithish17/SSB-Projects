import { useEffect, useState } from "react";
import {
  CreditCard,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "./css/adminPayment.css";

const PAYMENTS_PER_PAGE = 5;

const Payments = () => {
  const { showToast } = useToast();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ==========================================
  // FETCH PAYMENTS
  // ==========================================

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/payments");

      setPayments(res.data.payments || []);
      setCurrentPage(1);
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

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPayments = payments.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalPayments / PAYMENTS_PER_PAGE)
  );

  const startIndex =
    (currentPage - 1) * PAYMENTS_PER_PAGE;

  const currentPayments = payments.slice(
    startIndex,
    startIndex + PAYMENTS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
              {totalPayments} payments
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

          <>
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

                  {currentPayments.map((payment) => (

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

            {/* ====================================
                PAGINATION
            ==================================== */}

            {totalPages > 1 && (
              <div className="payments-pagination">

                <button
                  type="button"
                  className="pagination-nav"
                  onClick={() =>
                    handlePageChange(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <div className="pagination-pages">

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={
                        currentPage === page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        handlePageChange(page)
                      }
                    >
                      {page}
                    </button>
                  ))}

                </div>

                <button
                  type="button"
                  className="pagination-nav"
                  onClick={() =>
                    handlePageChange(currentPage + 1)
                  }
                  disabled={
                    currentPage === totalPages
                  }
                >
                  Next
                  <ChevronRight size={15} />
                </button>

              </div>
            )}

          </>
        )}

      </div>

    </div>
  );
};

export default Payments;
