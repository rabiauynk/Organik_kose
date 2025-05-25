
import { Navigate, Route, Routes } from 'react-router-dom';
import About from '../components/About';
import Cart from '../components/Cart';
import Checkout from '../components/Checkout';
import Footer from '../components/Footer';
import HomePage from '../components/HomePage';
import Login from '../components/Login';
import Navbar from '../components/Navbar';
import ProductDetail from '../components/ProductDetail';
import ProductList from '../components/ProductList';
import Register from '../components/Register';
import AdminCategories from '../components/admin/AdminCategories';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminOrders from '../components/admin/AdminOrders';
import AdminProducts from '../components/admin/AdminProducts';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/products" element={isAdmin ? <AdminProducts /> : <Navigate to="/login" />} />
          <Route path="/admin/orders" element={isAdmin ? <AdminOrders /> : <Navigate to="/login" />} />
          <Route path="/admin/categories" element={isAdmin ? <AdminCategories /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
