import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  LogOut,
  X,
  AlertTriangle,
  CheckCheck,
  Menu,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import api from "../Services/api";
import "./css/logout.css";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // SIDEBAR STATES
  // ==========================================

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(window.innerWidth <= 700);

  // ==========================================
  // NOTIFICATION STATES
  // ==========================================

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [notificationLoading, setNotificationLoading] =
    useState(false);

  // ==========================================
  // LOGOUT STATES
  // ==========================================

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  // ==========================================
  // RESPONSIVE SCREEN CHECK
  // ==========================================

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 700;

      setIsMobile(mobile);

      // Desktop-ku pona mobile sidebar close
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ==========================================
  // SIDEBAR TOGGLE
  // ==========================================

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  // ==========================================
  // CLOSE MOBILE SIDEBAR
  // ==========================================

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  // ==========================================
  // OPEN LOGOUT CONFIRMATION
  // ==========================================

  const handleLogoutClick = () => {
    setShowLogoutModal(true);

    // Mobile-la logout click aana sidebar close
    setMobileSidebarOpen(false);
  };

  // ==========================================
  // CLOSE LOGOUT MODAL
  // ==========================================

  const handleCloseLogout = () => {
    if (logoutLoading) return;

    setShowLogoutModal(false);
  };

  // ==========================================
  // CONFIRM LOGOUT
  // ==========================================

  const handleConfirmLogout = async () => {
    try {
      setLogoutLoading(true);

      logout();

      setShowLogoutModal(false);
    } finally {
      setLogoutLoading(false);
    }
  };

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================

  const fetchNotifications = async () => {
    try {
      setNotificationLoading(true);

      const response = await api.get("/notifications");

      console.log(
        "NOTIFICATION RESPONSE:",
        response.data
      );

      console.log("CURRENT USER:", user);

      console.log(
        "NOTIFICATIONS:",
        response.data?.notifications
      );

      setNotifications(
        response.data?.notifications || []
      );

      setUnreadCount(
        Number(response.data?.unreadCount || 0)
      );
    } catch (error) {
      console.log(
        "Notification Error:",
        error.response?.data || error.message
      );
    } finally {
      setNotificationLoading(false);
    }
  };

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const handleMarkAsRead = async (notification) => {
    try {
      if (!notification.isRead) {
        await api.put(
          `/notifications/${notification._id}/read`
        );

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );

        setUnreadCount((prev) =>
          prev > 0 ? prev - 1 : 0
        );
      }

      // ========================================
      // BOOKING NOTIFICATION CLICK
      // ========================================

      if (notification.booking?._id) {
        if (user.role === "admin") {
          navigate("/admin/bookings");
        } else if (user.role === "technician") {
          navigate("/technician/bookings");
        } else if (user.role === "customer") {
          navigate("/customer/bookings");
        }

        setShowNotifications(false);
      }
    } catch (error) {
      console.log(
        "Mark Read Error:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const handleMarkAllAsRead = async () => {
    try {
      if (unreadCount === 0) return;

      await api.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.log(
        "Mark All Read Error:",
        error.response?.data || error.message
      );
    }
  };

  // ==========================================
  // FORMAT NOTIFICATION TIME
  // ==========================================

  const formatNotificationTime = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() -
      notificationDate.getTime();

    const seconds = Math.floor(
      difference / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days} day${
        days > 1 ? "s" : ""
      } ago`;
    }

    return notificationDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // NOTIFICATION ICON
  // ==========================================

  const getNotificationIcon = (type) => {
    if (type === "payment") {
      return <Check size={16} />;
    }

    if (type === "assignment") {
      return <Bell size={16} />;
    }

    if (type === "booking") {
      return <Bell size={16} />;
    }

    if (type === "status") {
      return <Check size={16} />;
    }

    return <Bell size={16} />;
  };

  // ==========================================
  // NO USER
  // ==========================================

  if (!user) {
    return <Outlet />;
  }

  // ==========================================
  // MAIN LAYOUT
  // ==========================================

  return (
    <div
      className={`
        app-layout
        ${sidebarCollapsed ? "sidebar-collapsed" : ""}
        ${mobileSidebarOpen ? "mobile-menu-open" : ""}
      `}
    >

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <Sidebar
        collapsed={
          isMobile
            ? false
            : sidebarCollapsed
        }
        onToggle={toggleSidebar}
        onLogout={handleLogoutClick}
      />

      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}

      {isMobile && mobileSidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      {/* ======================================
          MAIN
      ====================================== */}

      <div className="app-main">

        {/* ====================================
            TOP HEADER
        ==================================== */}

        <header className="app-topbar">

          <div className="topbar-left">

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={toggleSidebar}
              aria-label={
                mobileSidebarOpen
                  ? "Close menu"
                  : "Open menu"
              }
            >
              {mobileSidebarOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>

            <span className="topbar-title">
              Smart Service Booking
            </span>

          </div>

          <div className="topbar-user">

            {/* ===============================
                NOTIFICATION
            =============================== */}

            <div className="notification-wrapper">

              <button
                type="button"
                className="topbar-notification"
                onClick={() =>
                  setShowNotifications(
                    (prev) => !prev
                  )
                }
                aria-label="Notifications"
              >
                <Bell size={19} />

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">

                  {/* HEADER */}

                  <div className="notification-dropdown-header">

                    <div>
                      <strong>
                        Notifications
                      </strong>

                      <span>
                        {unreadCount > 0
                          ? `${unreadCount} unread`
                          : "All caught up"}
                      </span>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="mark-all-btn"
                        onClick={
                          handleMarkAllAsRead
                        }
                      >
                        <CheckCheck size={14} />
                        Mark all
                      </button>
                    )}

                  </div>

                  {/* NOTIFICATION LIST */}

                  {notificationLoading ? (

                    <div className="notification-empty">

                      <Bell size={24} />

                      <p>
                        Loading notifications...
                      </p>

                    </div>

                  ) : notifications.length > 0 ? (

                    <div className="notification-list">

                      {notifications.map(
                        (notification) => (

                          <button
                            type="button"
                            key={
                              notification._id
                            }
                            className={`
                              notification-item
                              ${
                                notification.isRead
                                  ? "notification-read"
                                  : "notification-unread"
                              }
                            `}
                            onClick={() =>
                              handleMarkAsRead(
                                notification
                              )
                            }
                          >

                            <div className="notification-item-icon">
                              {getNotificationIcon(
                                notification.type
                              )}
                            </div>

                            <div className="notification-item-content">

                              <div className="notification-item-top">

                                <strong>
                                  {
                                    notification.title
                                  }
                                </strong>

                                {!notification.isRead && (
                                  <span className="notification-unread-dot" />
                                )}

                              </div>

                              <p>
                                {
                                  notification.message
                                }
                              </p>

                              <small>
                                {formatNotificationTime(
                                  notification.createdAt
                                )}
                              </small>

                            </div>

                          </button>
                        )
                      )}

                    </div>

                  ) : (

                    <div className="notification-empty">

                      <Bell size={24} />

                      <p>
                        You're all caught up.
                      </p>

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* ===============================
                DIVIDER
            =============================== */}

            <div className="topbar-divider" />

            {/* ===============================
                AVATAR
            =============================== */}

            <div className="topbar-avatar">
              {user.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>

            {/* ===============================
                USER INFO
            =============================== */}

            <div className="topbar-user-info">

              <strong>
                {user.name || "User"}
              </strong>

              <small>

                <span className="online-dot" />

                {user.role}

              </small>

            </div>

          </div>

        </header>

        {/* ====================================
            CONTENT
        ==================================== */}

        <main className="app-content">
          <Outlet />
        </main>

      </div>

      {/* ======================================
          LOGOUT CONFIRMATION MODAL
      ====================================== */}

      {showLogoutModal && (

        <div
          className="logout-modal-overlay"
          onClick={handleCloseLogout}
        >

          <div
            className="logout-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              className="logout-modal-close"
              onClick={handleCloseLogout}
              disabled={logoutLoading}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* ICON */}

            <div className="logout-modal-icon">
              <AlertTriangle size={24} />
            </div>

            {/* CONTENT */}

            <div className="logout-modal-content">

              <h3>
                Confirm Logout
              </h3>

              <p>
                Are you sure you want to logout
                from your account?
              </p>

            </div>

            {/* ACTIONS */}

            <div className="logout-modal-actions">

              <button
                type="button"
                className="logout-cancel-btn"
                onClick={handleCloseLogout}
                disabled={logoutLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="logout-confirm-btn"
                onClick={handleConfirmLogout}
                disabled={logoutLoading}
              >

                <LogOut size={15} />

                {logoutLoading
                  ? "Logging out..."
                  : "Logout"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Layout;
