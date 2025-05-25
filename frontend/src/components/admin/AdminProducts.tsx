import { ArrowLeft, Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Category, ProductDTO } from '../../services/api';

interface ProductUI {
  id: string;
  isim: string;
  fiyat: number;
  kategori_id: string;
  stok: number;
  status: 'Aktif' | 'Pasif';
  resim_url: string;
  açıklama: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductUI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    isim: '',
    açıklama: '',
    fiyat: 0,
    stok: 0,
    categoryId: 0,
    resimUrl: ''
  });

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apiProducts, apiCategories] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories()
      ]);

      // Convert API products to UI products
      const productsUI: ProductUI[] = apiProducts.map(product => ({
        id: product.id.toString(),
        isim: product.isim,
        fiyat: product.fiyat,
        kategori_id: product.categoryId.toString(),
        stok: product.stok,
        status: product.aktif ? 'Aktif' : 'Pasif',
        resim_url: product.resimUrl || '/placeholder.svg',
        açıklama: product.açıklama
      }));

      setProducts(productsUI);
      setCategories(apiCategories);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id.toString() === categoryId);
    return category ? category.name : 'Diğer';
  };

  const filteredProducts = products.filter(product =>
    product.isim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(product.kategori_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await apiService.deleteProduct(id);
        await loadData(); // Reload products
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Ürün silinirken bir hata oluştu.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData: ProductDTO = {
        isim: formData.isim,
        açıklama: formData.açıklama,
        fiyat: formData.fiyat,
        stok: formData.stok,
        categoryId: formData.categoryId,
        resimUrl: formData.resimUrl || '/placeholder.svg'
      };

      if (editingProduct) {
        await apiService.updateProduct(editingProduct.id, productData);
      } else {
        await apiService.createProduct(productData);
      }

      await loadData(); // Reload products
      closeModal();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Ürün kaydedilirken bir hata oluştu.');
    }
  };

  const openEditModal = (product: ProductUI) => {
    setEditingProduct(product);
    setFormData({
      isim: product.isim,
      açıklama: product.açıklama,
      fiyat: product.fiyat,
      stok: product.stok,
      categoryId: parseInt(product.kategori_id),
      resimUrl: product.resim_url
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setFormData({
      isim: '',
      açıklama: '',
      fiyat: 0,
      stok: 0,
      categoryId: 0,
      resimUrl: ''
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'Aktif'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
              <p className="text-gray-600 mt-2">Ürünlerinizi ekleyin, düzenleyin ve yönetin</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 sm:mt-0 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni Ürün</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Ürünler yükleniyor...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Ürün</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Kategori</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Fiyat</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Stok</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">Durum</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.resim_url}
                            alt={product.isim}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <span className="font-medium text-gray-900">{product.isim}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{getCategoryName(product.kategori_id)}</td>
                      <td className="py-4 px-6 font-medium">₺{product.fiyat}</td>
                      <td className="py-4 px-6">
                        <span className={`font-medium ${getStockColor(product.stok)}`}>
                          {product.stok} adet
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Product Modal */}
        {(showAddModal || editingProduct) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.isim}
                    onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={0}>Kategori seçin</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.açıklama}
                    onChange={(e) => setFormData({ ...formData, açıklama: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.fiyat}
                    onChange={(e) => setFormData({ ...formData, fiyat: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stok
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stok}
                    onChange={(e) => setFormData({ ...formData, stok: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resim URL
                  </label>
                  <input
                    type="url"
                    value={formData.resimUrl}
                    onChange={(e) => setFormData({ ...formData, resimUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingProduct ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
