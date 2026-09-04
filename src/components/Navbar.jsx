import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./css/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  let navLinks = [];

  // ================= ADMIN =================

  if (user.role === "admin") {
    navLinks = [
      {
        path: "/admin/dashboard",
        label: "Dashboard",
        icon: "",
      },
      {
        path: "/admin/bookings",
        label: "Bookings",
        icon: "",
      },
      {
        path: "/admin/services",
        label: "Services",
        icon: "",
      },
      {
        path: "/admin/technicians",
        label: "Technicians",
        icon: "",
      },
      {
        path: "/admin/payments",
        label: "Payments",
        icon: "",
      },
    ];
  }

  // ================= TECHNICIAN =================

  else if (user.role === "technician") {
    navLinks = [
      {
        path: "/technician/dashboard",
        label: "Dashboard",
        icon: "",
      },
    ];
  }

  // ================= CUSTOMER =================

  else {
    navLinks = [
      {
        path: "/customer/dashboard",
        label: "Dashboard",
        icon: "",
      },
      {
        path: "/customer/services",
        label: "Services",
        icon: "",
      },
      {
        path: "/customer/bookings",
        label: "Bookings",
        icon: "",
      },
      {
        path: "/customer/payment",
        label: "Payments",
        icon: "",
      },
    ];
  }

  const goHome = () => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user.role === "technician") {
      navigate("/technician/dashboard");
    } else {
      navigate("/customer/dashboard");
    }
  };

  return (
    <nav className="app-navbar">

      {/* LOGO */}

      <div
        className="navbar-brand"
        onClick={goHome}
      >

        <div className="navbar-brand-text">
          <strong>Smart Service</strong>
          <span>Booking</span>
        </div>
      </div>

      {/* NAVIGATION */}

      <div className="navbar-links">

        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "navbar-link active"
                : "navbar-link"
            }
          >
            <span className="navbar-link-icon">
              {link.icon}
            </span>

            <span>{link.label}</span>
          </NavLink>
        ))}

      </div>

      {/* USER */}

      <div className="navbar-user">

        <div className="navbar-user-info">

          <div className="navbar-avatar">
            {user.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>

          <div className="navbar-user-details">
            <strong>
              {user.name || "User"}
            </strong>

            <small>
              {user.role}
            </small>
          </div>

        </div>

        {/* LOGOUT */}

        <button
          className="navbar-logout"
          onClick={handleLogout}
        >

          <span>Logout</span>
        </button>

      </div>

    </nav>
  );
};

export default Navbar;
