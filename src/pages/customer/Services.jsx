import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  ArrowLeft,
  ArrowRight,
  Clock3,
  IndianRupee,
  Loader2,
  CalendarDays,
} from "lucide-react";

import api from "../../Services/api";
import { useToast } from "../../context/ToastContext";
import "../customer/css/services.css";

const Services = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FORMAT DURATION
  // ==========================================

  const formatDuration = (minutes) => {
    const totalMinutes = Number(minutes);

    if (
      !Number.isFinite(totalMinutes) ||
      totalMinutes <= 0
    ) {
      return "Flexible";
    }

    const hours = Math.floor(
      totalMinutes / 60
    );

    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours} hr ${mins} min`;
    }

    if (hours > 0) {
      return `${hours} hr`;
    }

    return `${mins} min`;
  };

  // ==========================================
  // FETCH SERVICES
  // ==========================================

  const fetchServices = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/services");

      setServices(
        response.data.services ||
          response.data ||
          []
      );
    } catch (err) {
      console.error(
        "FETCH SERVICES ERROR:",
        err.response?.data || err.message
      );

      showToast(
        err.response?.data?.message ||
          "Unable to load services",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ==========================================
  // BOOK NOW
  // ==========================================

  const handleBookNow = (service) => {
    navigate(
      "/customer/book-service",
      {
        state: {
          service,
        },
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="services-page">

        <div className="services-loading">

          <Loader2
            size={34}
            className="loading-spinner-icon"
          />

          <p>
            Loading services...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="services-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="services-header">

        <div className="services-header-content">

          <span className="services-label">
            OUR SERVICES
          </span>

          <h1>
            Choose a Service
          </h1>

          <p>
            Select the service you need and book it
            easily with our trusted professionals.
          </p>

        </div>

        <button
          type="button"
          className="back-dashboard-btn"
          onClick={() =>
            navigate("/customer/dashboard")
          }
        >
          <ArrowLeft size={15} />
          Dashboard
        </button>

      </div>

      {/* ======================================
          EMPTY
      ====================================== */}

      {services.length === 0 && (
        <div className="services-empty">

          <div className="empty-service-icon">
            <Wrench size={28} />
          </div>

          <h2>
            No Services Available
          </h2>

          <p>
            New services will be available soon.
          </p>

        </div>
      )}

      {/* ======================================
          SERVICE GRID
      ====================================== */}

      {services.length > 0 && (
        <div className="services-grid">

          {services.map((service) => (

            <div
              className="service-card"
              key={service._id}
            >

              {/* CARD TOP */}

              <div className="service-card-top">

                <div className="service-icon">
                  <Wrench size={21} />
                </div>

                <span className="service-status">
                  Available
                </span>

              </div>

              {/* CONTENT */}

              <div className="service-content">

                <h2>
                  {service.name}
                </h2>

                <p>
                  {service.description ||
                    "Professional service provided by our trusted technicians."}
                </p>

              </div>

              {/* DETAILS */}

              <div className="service-details">

                {/* PRICE */}

                <div className="service-detail-item">

                  <span>
                    <IndianRupee size={12} />
                    Price
                  </span>

                  <strong>
                    ₹
                    {Number(
                      service.price || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                {/* DURATION */}

                <div className="service-detail-item">

                  <span>
                    <Clock3 size={12} />
                    Duration
                  </span>

                  <strong>
                    {formatDuration(
                      service.duration
                    )}
                  </strong>

                </div>

              </div>

              {/* BOOK NOW */}

              <button
                type="button"
                className="book-now-btn"
                onClick={() =>
                  handleBookNow(service)
                }
              >
                <CalendarDays size={15} />

                Book Now

                <ArrowRight
                  size={15}
                  className="book-arrow"
                />
              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Services;
