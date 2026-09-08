import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Wrench,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  CalendarDays,
  HardHat,
  MapPin,
  CircleCheck,
} from "lucide-react";

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

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  /* =====================================================
     ROUTE CHANGE
  ===================================================== */

  useEffect(() => {
    setIsRegister(location.pathname === "/register");
  }, [location.pathname]);

  /* =====================================================
     LOGIN INPUT
  ===================================================== */

  const handleLoginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =====================================================
     REGISTER INPUT
  ===================================================== */

  const handleRegisterChange = (e) => {
    setRegisterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =====================================================
     LOGIN
  ===================================================== */

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

      const result = await login(loginData.email.trim(), loginData.password);

      if (!result?.success) {
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

  /* =====================================================
     REGISTER
  ===================================================== */

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
      showToast("Password must be at least 6 characters", "warning");
      return;
    }

    try {
      setRegisterLoading(true);

      const result = await register({
        ...registerData,
        name: registerData.name.trim(),
        email: registerData.email.trim(),
      });

      if (!result?.success) {
        return;
      }

      navigate("/login");
    } finally {
      setRegisterLoading(false);
    }
  };

  /* =====================================================
     SWITCH TO LOGIN
  ===================================================== */

  const showLogin = () => {
    setIsRegister(false);
    navigate("/login");
  };

  /* =====================================================
     SWITCH TO REGISTER
  ===================================================== */

  const showRegister = () => {
    setIsRegister(true);
    navigate("/register");
  };

  return (
    <main className="auth-page">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="auth-background">
        <div className="background-glow glow-one"></div>
        <div className="background-glow glow-two"></div>
      </div>

      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <section className="auth-layout">
        {/* =================================================
            AUTH CARD
        ================================================= */}

        <div className="auth-card">
          {/* =================================================
              BRAND
          ================================================= */}

          <div className="auth-brand">
            <div className="brand-logo">
              <Wrench size={31} strokeWidth={3} />
            </div>

            <div className="brand-name">
              <h2>Smart Service</h2>
              <span>Booking</span>
            </div>
          </div>

          {/* =================================================
              LOGIN PAGE
          ================================================= */}

          {!isRegister && (
            <div className="auth-content">
              <div className="orange-line"></div>

              <h1>Welcome Back</h1>

              <p className="auth-description">
                Sign in to your account to continue your service journey.
              </p>

              <form className="auth-form" onSubmit={handleLogin}>
                {/* EMAIL */}

                <div className="input-wrapper">
                  <Mail className="input-icon" size={21} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    autoComplete="email"
                  />
                </div>

                {/* PASSWORD */}

                <div className="input-wrapper">
                  <LockKeyhole className="input-icon" size={21} />

                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-button"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label="Show or hide password"
                  >
                    {showLoginPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loginLoading}
                >
                  <span>{loginLoading ? "Logging in..." : "Login"}</span>

                  {!loginLoading && <ArrowRight size={21} />}
                </button>
              </form>

              {/* REGISTER LINK */}

              <div className="account-switch">
                <span>Don’t have an account?</span>

                <button type="button" onClick={showRegister}>
                  Register Now
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              REGISTER PAGE
          ================================================= */}

          {isRegister && (
            <div className="auth-content register-content">
              <div className="orange-line"></div>

              <h1>Create Account</h1>

              <p className="auth-description">
                Create your account and start your service journey.
              </p>

              <form className="auth-form" onSubmit={handleRegister}>
                {/* NAME */}

                <div className="input-wrapper">
                  <User className="input-icon" size={21} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    autoComplete="name"
                  />
                </div>

                {/* EMAIL */}

                <div className="input-wrapper">
                  <Mail className="input-icon" size={21} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    autoComplete="email"
                  />
                </div>

                {/* PASSWORD */}

                <div className="input-wrapper">
                  <LockKeyhole className="input-icon" size={21} />

                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-button"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                    aria-label="Show or hide password"
                  >
                    {showRegisterPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  className="auth-button"
                  disabled={registerLoading}
                >
                  <span>
                    {registerLoading ? "Creating..." : "Create Account"}
                  </span>

                  {!registerLoading && <ArrowRight size={21} />}
                </button>
              </form>

              {/* LOGIN LINK */}

              <div className="account-switch">
                <span>Already have an account?</span>

                <button type="button" onClick={showLogin}>
                  Sign In
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            RIGHT SIDE - SERVICE JOURNEY
        ================================================= */}

        <div className="right-content">
          <div className="service-journey">
            {/* JOURNEY TITLE */}

            <div className="journey-title">
              <span>From Booking</span>

              <br />

              <span>to Completion</span>

              <div className="journey-underline"></div>
            </div>

            {/* =================================================
                BOOK
            ================================================= */}

            <div className="journey-step">
              <div className="journey-icon active">
                <CalendarDays size={29} strokeWidth={2.5} />
              </div>

              <div className="journey-text">
                <h3>BOOK</h3>

                <p>
                  Schedule your service
                  <br />
                  at your convenience.
                </p>
              </div>
            </div>

            {/* =================================================
                ASSIGN
            ================================================= */}

            <div className="journey-step">
              <div className="journey-icon">
                <HardHat size={29} strokeWidth={2.5} />
              </div>

              <div className="journey-text">
                <h3>ASSIGN</h3>

                <p>
                  We assign the best
                  <br />
                  technician for your service.
                </p>
              </div>
            </div>

            {/* =================================================
                TRACK
            ================================================= */}

            <div className="journey-step">
              <div className="journey-icon">
                <MapPin size={29} strokeWidth={2.5} />
              </div>

              <div className="journey-text">
                <h3>TRACK</h3>

                <p>
                  Track your technician
                  <br />
                  in real-time.
                </p>
              </div>
            </div>

            {/* =================================================
                COMPLETE
            ================================================= */}

            <div className="journey-step complete-step">
              <div className="journey-icon complete">
                <CircleCheck size={30} strokeWidth={2.5} />
              </div>

              <div className="journey-text">
                <h3>COMPLETE</h3>

                <p>
                  Your service is completed
                  <br />
                  with satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Auth;
