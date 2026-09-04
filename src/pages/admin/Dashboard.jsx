import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Wrench,
  CalendarDays,
  UserRoundCog,
  Clock3,
  CheckCircle2,
  XCircle,
  IndianRupee,
  RefreshCw,
  ArrowRight,
  BriefcaseBusiness,
  CreditCard,
  Activity,
} from "lucide-react";

import api from "../../Services/api";
import "./css/adminDashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTechnicians: 0,
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    activeServices: 0,
    completedServices: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ================= FETCH STATS =================

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await api.get("/dashboard/stats");

      setStats({
        totalCustomers: res.data.totalCustomers || 0,
        totalTechnicians: res.data.totalTechnicians || 0,
        totalServices: res.data.totalServices || 0,
        totalBookings: res.data.totalBookings || 0,
        pendingBookings: res.data.pendingBookings || 0,
        activeServices: res.data.activeServices || 0,
        completedServices: res.data.completedServices || 0,
        cancelledBookings: res.data.cancelledBookings || 0,
        totalRevenue: res.data.totalRevenue || 0,
      });
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="admin-dashboard-spinner"></div>

        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-dashboard-header">

        <div>
          <span className="admin-dashboard-eyebrow">
            SMART SERVICE BOOKING
          </span>

          <h1>Dashboard</h1>

          <p>
            Manage your service booking platform from one place.
          </p>
        </div>

        <div className="admin-dashboard-actions">

          <button
            className="admin-refresh-btn"
            onClick={() => fetchStats(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={16}
              className={refreshing ? "spin-icon" : ""}
            />

            <span>
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>

          <button
            className="admin-manage-btn"
            onClick={() =>
              navigate("/admin/bookings")
            }
          >
            <span>Manage Bookings</span>

            <ArrowRight size={16} />
          </button>

        </div>

      </div>

      {/* =================================================
          MAIN STAT CARDS
      ================================================= */}

      <div className="admin-stats-grid">

        {/* CUSTOMERS */}

        <div className="admin-stat-card blue">

          <div className="admin-stat-card-header">

            <div className="admin-stat-icon">
              <Users size={21} />
            </div>

            <span className="stat-mini-label">
              CUSTOMERS
            </span>

          </div>

          <div className="admin-stat-content">

            <span>Total Customers</span>

            <h2>
              {stats.totalCustomers}
            </h2>

            <p>
              Registered customers
            </p>

          </div>

        </div>

        {/* TECHNICIANS */}

        <div className="admin-stat-card green">

          <div className="admin-stat-card-header">

            <div className="admin-stat-icon">
              <UserRoundCog size={21} />
            </div>

            <span className="stat-mini-label">
              TEAM
            </span>

          </div>

          <div className="admin-stat-content">

            <span>Total Technicians</span>

            <h2>
              {stats.totalTechnicians}
            </h2>

            <p>
              Active service technicians
            </p>

          </div>

        </div>

        {/* SERVICES */}

        <div className="admin-stat-card purple">

          <div className="admin-stat-card-header">

            <div className="admin-stat-icon">
              <Wrench size={21} />
            </div>

            <span className="stat-mini-label">
              SERVICES
            </span>

          </div>

          <div className="admin-stat-content">

            <span>Total Services</span>

            <h2>
              {stats.totalServices}
            </h2>

            <p>
              {stats.activeServices} active services
            </p>

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="admin-stat-card orange">

          <div className="admin-stat-card-header">

            <div className="admin-stat-icon">
              <CalendarDays size={21} />
            </div>

            <span className="stat-mini-label">
              BOOKINGS
            </span>

          </div>

          <div className="admin-stat-content">

            <span>Total Bookings</span>

            <h2>
              {stats.totalBookings}
            </h2>

            <p>
              {stats.pendingBookings} pending bookings
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <div className="admin-overview-grid">

        {/* PENDING */}

        <div className="admin-overview-card">

          <div className="overview-icon pending">
            <Clock3 size={20} />
          </div>

          <div className="overview-content">

            <span>Pending Bookings</span>

            <h2>
              {stats.pendingBookings}
            </h2>

            <p>
              Waiting for confirmation
            </p>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="admin-overview-card">

          <div className="overview-icon completed">
            <CheckCircle2 size={20} />
          </div>

          <div className="overview-content">

            <span>Completed Services</span>

            <h2>
              {stats.completedServices}
            </h2>

            <p>
              Successfully completed
            </p>

          </div>

        </div>

        {/* CANCELLED */}

        <div className="admin-overview-card">

          <div className="overview-icon cancelled">
            <XCircle size={20} />
          </div>

          <div className="overview-content">

            <span>Cancelled Bookings</span>

            <h2>
              {stats.cancelledBookings}
            </h2>

            <p>
              Cancelled bookings
            </p>

          </div>

        </div>

        {/* REVENUE */}

        <div className="admin-overview-card">

          <div className="overview-icon revenue">
            <IndianRupee size={20} />
          </div>

          <div className="overview-content">

            <span>Total Revenue</span>

            <h2>
              ₹
              {Number(
                stats.totalRevenue
              ).toLocaleString("en-IN")}
            </h2>

            <p>
              Revenue from paid bookings
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <div className="admin-quick-section">

        <div className="admin-section-heading">

          <div>
            <span>ADMIN TOOLS</span>

            <h2>Quick Actions</h2>

            <p>
              Manage the most important areas of your platform.
            </p>
          </div>

        </div>

        <div className="admin-quick-grid">

          {/* BOOKINGS */}

          <button
            onClick={() =>
              navigate("/admin/bookings")
            }
            className="quick-card blue-action"
          >
            <div className="quick-action-icon">
              <CalendarDays size={21} />
            </div>

            <div className="quick-action-content">

              <strong>
                Manage Bookings
              </strong>

              <small>
                View and update customer bookings
              </small>

            </div>

            <ArrowRight
              size={17}
              className="quick-arrow"
            />
          </button>

          {/* SERVICES */}

          <button
            onClick={() =>
              navigate("/admin/services")
            }
            className="quick-card purple-action"
          >
            <div className="quick-action-icon">
              <Wrench size={21} />
            </div>

            <div className="quick-action-content">

              <strong>
                Manage Services
              </strong>

              <small>
                Add, edit and manage services
              </small>

            </div>

            <ArrowRight
              size={17}
              className="quick-arrow"
            />
          </button>

          {/* TECHNICIANS */}

          <button
            onClick={() =>
              navigate("/admin/technicians")
            }
            className="quick-card green-action"
          >
            <div className="quick-action-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div className="quick-action-content">

              <strong>
                Manage Technicians
              </strong>

              <small>
                Manage technician profiles
              </small>

            </div>

            <ArrowRight
              size={17}
              className="quick-arrow"
            />
          </button>

          {/* PAYMENTS */}

          <button
            onClick={() =>
              navigate("/admin/payments")
            }
            className="quick-card orange-action"
          >
            <div className="quick-action-icon">
              <CreditCard size={21} />
            </div>

            <div className="quick-action-content">

              <strong>
                Manage Payments
              </strong>

              <small>
                View customer payment records
              </small>

            </div>

            <ArrowRight
              size={17}
              className="quick-arrow"
            />
          </button>

        </div>

      </div>

      {/* =================================================
          PLATFORM SUMMARY
      ================================================= */}

      <div className="admin-platform-summary">

        <div className="platform-item">

          <div className="platform-item-icon">
            <Activity size={16} />
          </div>

          <div>
            <span>Platform Status</span>

            <strong className="system-active">
              <i></i>
              All Systems Active
            </strong>
          </div>

        </div>

        <div className="platform-item">

          <div className="platform-item-icon">
            <Wrench size={16} />
          </div>

          <div>
            <span>Active Services</span>

            <strong>
              {stats.activeServices}
            </strong>
          </div>

        </div>

        <div className="platform-item">

          <div className="platform-item-icon">
            <Users size={16} />
          </div>

          <div>
            <span>Technicians</span>

            <strong>
              {stats.totalTechnicians}
            </strong>
          </div>

        </div>

        <div className="platform-item">

          <div className="platform-item-icon">
            <IndianRupee size={16} />
          </div>

          <div>
            <span>Total Revenue</span>

            <strong>
              ₹
              {Number(
                stats.totalRevenue
              ).toLocaleString("en-IN")}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
