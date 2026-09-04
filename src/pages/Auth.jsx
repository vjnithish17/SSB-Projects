import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./auth.css";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [isRegister, setIsRegister] = useState(
    location.pathname === "/register",
  );

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // =========================
  // ROUTE CHANGE
  // =========================

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
  }, [location.pathname]);

  // =========================
  // LOGIN INPUT
  // =========================

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email.trim()) {
      showToast("Please enter your email address", "warning");
      return;
    }

    if (!loginData.password) {
      showToast("Please enter your password", "warning");
      return;
    }

    try {
      setLoginLoading(true);

      const result = await login(
        loginData.email.trim(),
        loginData.password,
      );

      if (!result.success) {
        return;
      }

      const role = result.user?.role;

      console.log("LOGIN USER:", result.user);
      console.log("LOGIN ROLE:", role);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "technician") {
        navigate("/technician/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // =========================
  // REGISTER INPUT
  // =========================

  const handleRegisterChange = (e) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerData.name.trim()) {
      showToast("Please enter your name", "warning");
      return;
    }

    if (!registerData.email.trim()) {
      showToast("Please enter your email address", "warning");
      return;
    }

    if (!registerData.password) {
      showToast("Please enter a password", "warning");
      return;
    }

    if (registerData.password.length < 6) {
      showToast(
        "Password must be at least 6 characters",
        "warning",
      );
      return;
    }

    try {
      setRegisterLoading(true);

      const result = await register({
        ...registerData,
        name: registerData.name.trim(),
        email: registerData.email.trim(),
      });

      if (!result.success) {
        return;
      }

      navigate("/login");
    } finally {
      setRegisterLoading(false);
    }
  };

  // =========================
  // SWITCH TO REGISTER
  // =========================

  const showRegister = () => {
    setIsRegister(true);
    navigate("/register");
  };

  // =========================
  // SWITCH TO LOGIN
  // =========================

  const showLogin = () => {
    setIsRegister(false);
    navigate("/login");
  };

  return (
    <div
      className={`auth-page ${
        isRegister ? "show-register" : ""
      }`}
    >
      <div className="auth-wrapper">

        {/* ======================
            LOGIN FORM
        ====================== */}

        <div className="auth-form login-form">
          <form onSubmit={handleLogin}>
            <h1>Welcome Back</h1>

            <p className="auth-subtitle">
              Login to Smart Service Booking
            </p>

            <div className="auth-input">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                autoComplete="email"
              />
            </div>

            <div className="auth-input">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loginLoading}
            >
              {loginLoading
                ? "Logging in..."
                : "LOGIN"}
            </button>
          </form>

          <p className="mobile-auth-switch">
            Don't have an account?

            <button
              type="button"
              onClick={showRegister}
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* ======================
            REGISTER FORM
        ====================== */}

        <div className="auth-form register-form">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>

            <p className="auth-subtitle">
              Register for Smart Service Booking
            </p>

            <div className="auth-input">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={registerData.name}
                onChange={handleRegisterChange}
                autoComplete="name"
              />
            </div>

            <div className="auth-input">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                autoComplete="email"
              />
            </div>

            <div className="auth-input">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={registerLoading}
            >
              {registerLoading
                ? "Creating..."
                : "REGISTER"}
            </button>
          </form>

          <p className="mobile-auth-switch">
            Already have an account?

            <button
              type="button"
              onClick={showLogin}
            >
              Sign In
            </button>
          </p>
        </div>

        {/* ======================
            SLIDING PANEL
        ====================== */}

        <div className="auth-overlay">

          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>

            <p>
              Keep connected with us. Login with
              your personal info to continue.
            </p>

            <button
              type="button"
              className="ghost-btn"
              onClick={showLogin}
            >
              LOG IN
            </button>
          </div>

          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>

            <p>
              Enter your personal details and start
              your journey with us.
            </p>

            <button
              type="button"
              className="ghost-btn"
              onClick={showRegister}
            >
              SIGN UP
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Auth;
