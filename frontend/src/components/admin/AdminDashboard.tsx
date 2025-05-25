
import { Eye, Globe, Package, Plus, ShoppingCart, Tag, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 24,
    pendingOrders: 8,
    totalCustomers: 156,
    monthlyRevenue: 12450
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getOrderStatusText = (status: string) => {
    // Geçici olarak eski İngilizce status'ları destekle
    switch (status?.toUpperCase()) {
      case 'PENDING':
      case 'PROCESSING':
        return 'Hazırlanıyor';
      case 'SHIPPED':
        return 'Kargoda';
      case 'DELIVERED':
        return 'Teslim Edildi';
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        // Eğer zaten Türkçe ise direkt döndür
        if (['Yeni', 'Hazırlanıyor', 'Kargoda', 'Teslim Edildi', 'İptal Edildi'].includes(status)) {
          return status;
        }
        return 'Yeni';
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Load real data from backend
        const [products, orders] = await Promise.all([
          apiService.getProducts(),
          apiService.getAllOrders().catch(() => []) // Fallback if orders fail
        ]);

        // Calculate monthly revenue from orders
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = orders
          .filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
          })
          .reduce((total, order) => total + (order.totalAmount || 0), 0);

        setDashboardStats({
          totalProducts: products.length,
          pendingOrders: orders.filter(order =>
            order.status === 'Hazırlanıyor' || order.status === 'PENDING'
          ).length,
          totalCustomers: 156, // Mock for now
          monthlyRevenue: monthlyRevenue
        });

        // Set recent orders (last 4 orders)
        const sortedOrders = orders
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, 4)
          .map(order => ({
            id: order.id.toString(),
            customer: order.userName || 'Müşteri',
            total: order.totalAmount || 0,
            status: getOrderStatusText(order.status),
            date: new Date(order.orderDate).toLocaleDateString('tr-TR')
          }));

        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to mock data
        setRecentOrders([
          { id: '1', customer: 'Ahmet Yılmaz', total: 95.50, status: 'Hazırlanıyor', date: '2024-01-15' },
          { id: '2', customer: 'Fatma Kaya', total: 67.00, status: 'Kargoda', date: '2024-01-15' },
          { id: '3', customer: 'Mehmet Öz', total: 156.75, status: 'Teslim Edildi', date: '2024-01-14' },
          { id: '4', customer: 'Zeynep Ak', total: 89.25, status: 'Hazırlanıyor', date: '2024-01-14' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const stats = [
    {
      title: 'Toplam Ürün',
      value: dashboardStats.totalProducts.toString(),
      change: '+2 bu ay',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Bekleyen Siparişler',
      value: dashboardStats.pendingOrders.toString(),
      change: '+3 bugün',
      icon: ShoppingCart,
      color: 'bg-orange-500'
    },
    {
      title: 'Toplam Müşteri',
      value: dashboardStats.totalCustomers.toString(),
      change: '+12 bu hafta',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Aylık Gelir',
      value: `₺${dashboardStats.monthlyRevenue.toLocaleString()}`,
      change: '+8% artış',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const quickActions = [
    { title: 'Yeni Ürün Ekle', icon: Plus, link: '/admin/products', color: 'bg-green-600' },
    { title: 'Siparişleri Görüntüle', icon: Eye, link: '/admin/orders', color: 'bg-blue-600' },
    { title: 'Ürünleri Yönet', icon: Package, link: '/admin/products', color: 'bg-purple-600' },
    { title: 'Kategori Yönetimi', icon: Tag, link: '/admin/categories', color: 'bg-orange-600' },
    { title: 'Siteyi Görüntüle', icon: Globe, link: '/', color: 'bg-gray-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hazırlanıyor':
        return 'bg-yellow-100 text-yellow-800';
      case 'İşleniyor':
        return 'bg-orange-100 text-orange-800';
      case 'Kargoda':
        return 'bg-blue-100 text-blue-800';
      case 'Teslim Edildi':
        return 'bg-green-100 text-green-800';
      case 'İptal Edildi':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Organik Köşe yönetim paneline hoş geldiniz</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`${action.color} text-white p-4 rounded-lg flex items-center space-x-3 hover:opacity-90 transition-opacity`}
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="font-medium">{action.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Son Siparişler</h2>
                <Link
                  to="/admin/orders"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Tümünü Gör
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Sipariş ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Müşteri</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Toplam</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Durum</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">#{order.id}</td>
                          <td className="py-3 px-4">{order.customer}</td>
                          <td className="py-3 px-4 font-medium">₺{order.total}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                          {loading ? 'Siparişler yükleniyor...' : 'Henüz sipariş bulunmuyor'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
