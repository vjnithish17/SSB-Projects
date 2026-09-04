import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  LayoutDashboard,
  CalendarDays,
  Wrench,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import "./css/sidebar.css";

const Sidebar = ({
  collapsed,
  onToggle,
  onLogout,
}) => {
  const { user } = useAuth();

  if (!user) return null;

  let links = [];

  // ================= ADMIN =================

  if (user.role === "admin") {
    links = [
      {
        path: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        path: "/admin/bookings",
        label: "Bookings",
        icon: CalendarDays,
      },
      {
        path: "/admin/services",
        label: "Services",
        icon: Wrench,
      },
      {
        path: "/admin/technicians",
        label: "Technicians",
        icon: Users,
      },
      {
        path: "/admin/payments",
        label: "Payments",
        icon: CreditCard,
      },
    ];
  }

  // ================= TECHNICIAN =================

  else if (user.role === "technician") {
    links = [
      {
        path: "/technician/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        path: "/technician/bookings",
        label: "My Bookings",
        icon: CalendarDays,
      },
      {
        path: "/technician/payments",
        label: "Payments",
        icon: CreditCard,
      },
    ];
  }

  // ================= CUSTOMER =================

  else {
    links = [
      {
        path: "/customer/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        path: "/customer/services",
        label: "Services",
        icon: Wrench,
      },
      {
        path: "/customer/bookings",
        label: "Bookings",
        icon: CalendarDays,
      },
      {
        path: "/customer/payment",
        label: "Payments",
        icon: CreditCard,
      },
    ];
  }

  return (
    <aside
      className={`app-sidebar ${
        collapsed ? "collapsed" : ""
      }`}
    >
      {/* ================= BRAND ================= */}

      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Wrench
            size={22}
            strokeWidth={2.2}
          />
        </div>

        {!collapsed && (
          <div className="sidebar-brand-text">
            <strong>Smart Service</strong>

            <span>
              {user.role === "admin"
                ? "Admin Panel"
                : user.role === "technician"
                ? "Technician Panel"
                : "Customer Panel"}
            </span>
          </div>
        )}
      </div>

      {/* ================= DIVIDER ================= */}

      <div className="sidebar-divider"></div>

      {/* ================= NAVIGATION ================= */}

      <div className="sidebar-navigation">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              title={
                collapsed
                  ? link.label
                  : ""
              }
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <Icon
                className="sidebar-icon"
                size={19}
                strokeWidth={2}
              />

              {!collapsed && (
                <span>{link.label}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* ================= BOTTOM ================= */}

      <div className="sidebar-bottom">

        {/* ================= LOGOUT ================= */}

        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
          title={
            collapsed
              ? "Logout"
              : ""
          }
        >
          <LogOut
            className="sidebar-icon"
            size={19}
            strokeWidth={2}
          />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>

        {/* ================= TOGGLE ================= */}

        <button
          className="sidebar-menu-btn"
          type="button"
          onClick={onToggle}
          title={
            collapsed
              ? "Expand Sidebar"
              : "Collapse Sidebar"
          }
        >
          {collapsed ? (
            <Menu size={20} />
          ) : (
            <X size={20} />
          )}
        </button>

      </div>
    </aside>
  );
};

export default Sidebar;
