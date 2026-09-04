import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Wrench,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "../customer/css/bookServices.css";

const BookService = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { showToast } = useToast();

  const service = location.state?.service;

  const [formData, setFormData] = useState({
    date: "",
    address: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // SERVICE NOT SELECTED
  // ==========================================

  if (!service) {
    return (
      <div className="book-service-page">

        <div className="booking-empty">

          <h2>
            Service Not Selected
          </h2>

          <p>
            Please select a service first.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/customer/services")
            }
          >
            Browse Services
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT BOOKING
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION

    if (!formData.date) {
      showToast(
        "Please select your preferred date and time",
        "warning"
      );
      return;
    }

    if (!formData.address.trim()) {
      showToast(
        "Please enter your service address",
        "warning"
      );
      return;
    }

    if (!formData.description.trim()) {
      showToast(
        "Please describe the service you need",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/bookings", {
        service: service._id,
        bookingDate: formData.date,
        address: formData.address.trim(),
        notes: formData.description.trim(),
      });

      showToast(
        "Booking created successfully",
        "success"
      );

      // Small delay so user can see toast
      // before navigation.
      setTimeout(() => {
        navigate("/customer/dashboard");
      }, 600);
    } catch (err) {
      console.error(
        "BOOKING ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to create booking",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-service-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="booking-page-header">

        <button
          type="button"
          className="back-btn"
          onClick={() =>
            navigate("/customer/services")
          }
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div>
          <span>
            BOOK SERVICE
          </span>

          <h1>
            Schedule Your Service
          </h1>

          <p>
            Provide the details below to create
            your service booking.
          </p>
        </div>

      </div>

      {/* ======================================
          BOOKING CONTAINER
      ====================================== */}

      <div className="booking-container">

        {/* ====================================
            SERVICE SUMMARY
        ==================================== */}

        <div className="selected-service">

          <div className="selected-service-icon">
            <Wrench size={21} />
          </div>

          <div>

            <span>
              SELECTED SERVICE
            </span>

            <h2>
              {service.name}
            </h2>

            <p>
              {service.description ||
                "Professional service"}
            </p>

          </div>

          <div className="selected-price">

            <small>
              Starting from
            </small>

            <strong>
              ₹
              {Number(
                service.price || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>

        </div>

        {/* ====================================
            FORM
        ==================================== */}

        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >

          <div className="form-heading">

            <h2>
              Booking Details
            </h2>

            <p>
              Tell us when and where you need
              the service.
            </p>

          </div>

          {/* DATE */}

          <div className="form-group">

            <label>
              Preferred Date & Time
            </label>

            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
            />

          </div>

          {/* ADDRESS */}

          <div className="form-group">

            <label>
              Service Address
            </label>

            <textarea
              name="address"
              rows="3"
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Service Description
            </label>

            <textarea
              name="description"
              rows="4"
              placeholder="Describe the problem or service you need..."
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
            />

          </div>

          {/* ACTION */}

          <button
            type="submit"
            className="confirm-booking-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Booking..."
              : (
                <>
                  Confirm Booking
                  <ArrowRight size={15} />
                </>
              )}
          </button>

        </form>

      </div>

    </div>
  );
};

export default BookService;
