import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts & Auth
import AdminLayout from "./layouts/AdminLayout";
import RequireAuth from "./auth/RequireAuth";
import { getAdmin } from "./auth/authStorage";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stores from "./pages/Stores";
import Blogs from "./pages/Blogs";
import Coupons from "./pages/Coupons";
import Deals from "./pages/Deals";
import Analytics from "./pages/Analytics";
import ContactMessages from "./pages/ContactMessages";
import Categories from "./pages/Categories";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Testimonials from "./pages/AdminTestimonials"

// ✅ NEW PAGES (Staff & Profile)
import ManageAdmins from "./pages/ManageAdmins";
import ProfileSettings from "./pages/ProfileSettings";

export default function App() {
  const admin = getAdmin(); // Storage se role nikalne ke liye

  return (
    <BrowserRouter>
      <Routes>
        {/* ========================================== */}
        {/* 1. PUBLIC ROUTES (Login, Forgot Pwd etc.)  */}
        {/* ========================================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
<Route path="/reset-password/:token" element={<ResetPassword />} />
{/* <Route path="/rp/:token" element={<ResetPassword />} /> */}
        {/* ========================================== */}
        {/* 2. PROTECTED ROUTES (Requires Login)       */}
        {/* ========================================== */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          {/* Default Page (Home) */}
          <Route index element={<Dashboard />} />

          {/* Standard Admin Modules */}
          <Route path="stores" element={<Stores />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="deals" element={<Deals />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="contact-messages" element={<ContactMessages />} />
          <Route path="admin/categories" element={<Categories />} />
          <Route path="admin/testimonials" element={<Testimonials />} />
          
          {/* User Profile & Security (OTP base update) */}
          <Route path="admin/profile" element={<ProfileSettings />} />

          {/* 🔐 SUPER ADMIN ONLY ROUTE */}
          {/* Agar koi URL se access karega toh dashboard pe redirect ho jayega */}
          <Route 
            path="admin/manage-admins" 
            element={
              admin?.role === "SUPER_ADMIN" 
                ? <ManageAdmins /> 
                : <Navigate to="/" replace />
            } 
          />
        </Route>

        {/* ========================================== */}
        {/* 3. CATCH-ALL (404 Redirect)                */}
        {/* ========================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}