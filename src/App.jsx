import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import Orders from "./pages/user/Orders";
import Payments from "./pages/user/Payments";
import PrivateRoute from "./components/layout/PrivateRoute";
import Navigation from "./components/layout/Navigation";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import OrderDetails from "./pages/user/OrderDetails";
import Checkout from "./pages/user/Checkout";
import Profile from "./pages/user/Profile";
import AdminUserDetails from "./pages/admin/AdminUserDetails";

const ProtectedLayout = ({ children }) => {
  return (
    <PrivateRoute>
      <Navigation />
      <div className="container mt-4">{children}</div>
    </PrivateRoute>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <ProtectedLayout>
              <Home />
            </ProtectedLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedLayout>
              <Profile />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedLayout>
              <AdminUserDetails />
            </ProtectedLayout>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedLayout>
              <Products />
            </ProtectedLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedLayout>
              <Cart />
            </ProtectedLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedLayout>
              <Orders />
            </ProtectedLayout>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedLayout>
              <OrderDetails />
            </ProtectedLayout>
          }
        />
        <Route
          path="/checkout/:id"
          element={
            <ProtectedLayout>
              <Checkout />
            </ProtectedLayout>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedLayout>
              <Payments />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedLayout>
              <AdminUsers />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedLayout>
              <AdminOrders />
            </ProtectedLayout>
          }
        />

        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
