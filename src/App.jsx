import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";

import Layout from "./components/Layout";

import ProtectedRoute from "./components/ProtectedRoute";

// ================= CUSTOMER =================

import CustomerDashboard from "./pages/customer/Dashboard";
import Services from "./pages/customer/Services";
import BookService from "./pages/customer/BookService";
import Bookings from "./pages/customer/Bookings";
import Payment from "./pages/customer/Payment";

// ================= ADMIN =================

import AdminDashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/Bookings";
import AdminServices from "./pages/admin/AdminServices";
import Technicians from "./pages/admin/Technicians";
import AdminPayments from "./pages/admin/Payments";

// ================= TECHNICIAN =================

import TechnicianDashboard from "./pages/techincian/Dashboard";
import Payments from "./pages/techincian/Payments";
import TechnicianMyBookings from "./pages/techincian/Bookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}

        <Route path="/login" element={<Auth />} />

        <Route path="/register" element={<Auth />} />

        {/* ================= PROTECTED LAYOUT ================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["customer", "admin", "technician"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* ================= CUSTOMER ================= */}

          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/services"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Services />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/book-service"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <BookService />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/bookings"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Bookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/payment"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/services"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminServices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/technicians"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Technicians />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPayments />
              </ProtectedRoute>
            }
          />

          {/* ================= TECHNICIAN ================= */}

          <Route
            path="/technician/dashboard"
            element={
              <ProtectedRoute allowedRoles={["technician"]}>
                <TechnicianDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician/payments"
            element={
              <ProtectedRoute role="technician">
                <Payments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/technician/bookings"
            element={
              <ProtectedRoute role="technician">
                <TechnicianMyBookings />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= ROOT ================= */}

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ================= INVALID ================= */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
