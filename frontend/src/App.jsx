import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import Loader from './components/common/Loader';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const MensPage = lazy(() => import('./pages/MensPage'));
const WomensPage = lazy(() => import('./pages/WomensPage'));
const SareesPage = lazy(() => import('./pages/SareesPage'));
const FabricsPage = lazy(() => import('./pages/FabricsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const InquiryManagement = lazy(() => import('./pages/admin/InquiryManagement'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mens" element={<MensPage />} />
              <Route path="/mens/:category" element={<MensPage />} />
              <Route path="/womens" element={<WomensPage />} />
              <Route path="/womens/:category" element={<WomensPage />} />
              <Route path="/sarees" element={<SareesPage />} />
              <Route path="/sarees/:type" element={<SareesPage />} />
              <Route path="/fabrics" element={<FabricsPage />} />
              <Route path="/fabrics/:type" element={<FabricsPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/products" element={<ProductManagement />} />
                  <Route path="/admin/orders" element={<OrderManagement />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/inquiries" element={<InquiryManagement />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
