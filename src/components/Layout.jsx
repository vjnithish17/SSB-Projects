import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Bell,
  Check,
  LogOut,
  X,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import "./css/logout.css";

const Layout = () => {
  const { user, logout } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  if (!user) {
    return <Outlet />;
  }

  // ==========================================
  // SIDEBAR TOGGLE
  // ==========================================

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // ==========================================
  // OPEN LOGOUT CONFIRMATION
  // ==========================================

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
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
  // NOTIFICATIONS
  // ==========================================

  const notificationCount =
    Number(user.notificationCount || 0);

  const hasNotifications =
    notificationCount > 0;

  return (
    <div
      className={`app-layout ${
        sidebarCollapsed
          ? "sidebar-collapsed"
          : ""
      }`}
    >

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onLogout={handleLogoutClick}
      />

      {/* ======================================
          MAIN
      ====================================== */}

      <div className="app-main">

        {/* ====================================
            TOP HEADER
        ==================================== */}

        <header className="app-topbar">

          <div className="topbar-left">
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

                {hasNotifications && (
                  <span className="notification-badge">
                    {notificationCount > 99
                      ? "99+"
                      : notificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">

                  <div className="notification-dropdown-header">

                    <div>
                      <strong>
                        Notifications
                      </strong>

                      <span>
                        {hasNotifications
                          ? `${notificationCount} new`
                          : "No new notifications"}
                      </span>
                    </div>

                  </div>

                  {hasNotifications ? (
                    <div className="notification-item">

                      <div className="notification-item-icon">
                        <Check size={16} />
                      </div>

                      <div className="notification-item-content">

                        <strong>
                          {user.role ===
                          "admin"
                            ? "New booking received"
                            : user.role ===
                              "technician"
                            ? "New booking assigned"
                            : "Booking update"}
                        </strong>

                        <p>
                          {user.role ===
                          "admin"
                            ? "A customer has created a new service booking."
                            : user.role ===
                              "technician"
                            ? "A new booking has been assigned to you."
                            : "You have a new booking update."}
                        </p>

                      </div>

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

            <div className="topbar-divider"></div>

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
                <span className="online-dot"></span>

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
