
import { ArrowLeft, Eye, Package, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';

interface OrderUI {
  id: string;
  kullanıcı_id: string;
  tarih: string;
  toplam_tutar: number;
  durum: 'Yeni' | 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi' | 'İptal Edildi';
  kullanıcı_adı: string;
  kullanıcı_email: string;
  detaylar: any[];
  adres: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderUI[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderUI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const apiOrders = await apiService.getAllOrders();

      // Convert API orders to UI orders
      const ordersUI: OrderUI[] = apiOrders.map(order => ({
        id: order.id.toString(),
        kullanıcı_id: order.userId?.toString() || '',
        kullanıcı_adı: order.userName || 'Müşteri',
        kullanıcı_email: order.customerEmail || '',
        toplam_tutar: Number(order.totalAmount) || 0,
        durum: getOrderStatusText(order.status),
        tarih: new Date(order.orderDate).toLocaleDateString('tr-TR'),
        detaylar: order.orderDetails || [],
        adres: order.customerAddress || 'Adres belirtilmemiş'
      }));

      setOrders(ordersUI);
    } catch (error) {
      console.error('Failed to load orders:', error);
      // Fallback to mock data
      setOrders([
        {
          id: '1',
          kullanıcı_id: '101',
          kullanıcı_adı: 'Ahmet Yılmaz',
          kullanıcı_email: 'ahmet@email.com',
          toplam_tutar: 95.50,
          durum: 'Hazırlanıyor',
          tarih: '2024-01-15',
          detaylar: [],
          adres: 'Kadıköy, İstanbul'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Artık çeviri yapmıyoruz, direkt Türkçe status kullanıyoruz
  const getOrderStatusText = (status: string): OrderUI['durum'] => {
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
          return status as OrderUI['durum'];
        }
        return 'Yeni';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Yeni':
        return 'bg-blue-100 text-blue-800';
      case 'Hazırlanıyor':
        return 'bg-yellow-100 text-yellow-800';
      case 'Kargoda':
        return 'bg-purple-100 text-purple-800';
      case 'Teslim Edildi':
        return 'bg-green-100 text-green-800';
      case 'İptal Edildi':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderUI['durum']) => {
    try {
      // Artık direkt Türkçe status gönderiyoruz
      await apiService.updateOrderStatus(orderId, newStatus);

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, durum: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Sipariş durumu güncellenirken bir hata oluştu.');
    }
  };

  const statusOptions: OrderUI['durum'][] = ['Yeni', 'Hazırlanıyor', 'Kargoda', 'Teslim Edildi', 'İptal Edildi'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Admin Panel'e Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Sipariş Yönetimi</h1>
          <p className="text-gray-600 mt-2">Siparişleri görüntüleyin ve durumlarını güncelleyin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.durum === 'Hazırlanıyor').length}
                </p>
              </div>
              <Package className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Kargoda</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.durum === 'Kargoda').length}
                </p>
              </div>
              <Truck className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teslim Edildi</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.durum === 'Teslim Edildi').length}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Siparişler yükleniyor...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Sipariş ID</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Müşteri</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Toplam</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Durum</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Tarih</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">#{order.id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{order.kullanıcı_adı}</p>
                        <p className="text-sm text-gray-600">{order.kullanıcı_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">₺{order.toplam_tutar.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <select
                        value={order.durum}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderUI['durum'])}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.durum)}`}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{order.tarih}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                        Henüz sipariş bulunmuyor
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Sipariş Detayı #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Müşteri Bilgileri</h3>
                    <p className="text-gray-600">{selectedOrder.kullanıcı_adı}</p>
                    <p className="text-gray-600">{selectedOrder.kullanıcı_email}</p>
                    <p className="text-gray-600">{selectedOrder.adres}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sipariş Bilgileri</h3>
                    <p className="text-gray-600">Tarih: {selectedOrder.tarih}</p>
                    <p className="text-gray-600">
                      Durum: <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.durum)}`}>
                        {selectedOrder.durum}
                      </span>
                    </p>
                    <p className="text-gray-600 font-semibold">Toplam: ₺{selectedOrder.toplam_tutar.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sipariş İçeriği</h3>
                  <div className="space-y-2">
                    {selectedOrder.detaylar && selectedOrder.detaylar.length > 0 ? (
                      selectedOrder.detaylar.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">{item.productName || item.ürün_adı} x {item.quantity || item.adet}</span>
                          <span className="font-medium">₺{((item.price || item.fiyat) * (item.quantity || item.adet)).toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Sipariş detayları yüklenemedi</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
