
import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Category } from '../../services/api';

interface CategoryUI extends Category {
  productCount: number;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<CategoryUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryUI | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  });

  // Load categories from API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const apiCategories = await apiService.getCategories();
      // Convert API categories to UI categories with product count (mock for now)
      const categoriesWithCount: CategoryUI[] = apiCategories.map(category => ({
        ...category,
        productCount: Math.floor(Math.random() * 20) + 1 // Mock product count
      }));
      setCategories(categoriesWithCount);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await apiService.deleteCategory(id);
        await loadCategories(); // Reload categories
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Kategori silinirken bir hata oluştu.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.id.toString(), formData);
      } else {
        await apiService.createCategory(formData);
      }
      await loadCategories(); // Reload categories
      setShowAddModal(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '', icon: '' });
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Kategori kaydedilirken bir hata oluştu.');
    }
  };

  const openEditModal = (category: CategoryUI) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', icon: '' });
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
              <h1 className="text-3xl font-bold text-gray-900">Kategori Yönetimi</h1>
              <p className="text-gray-600 mt-2">Ürün kategorilerini ekleyin ve yönetin</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 sm:mt-0 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Yeni Kategori</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Kategoriler yükleniyor...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.productCount} ürün</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id.toString())}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Category Modal */}
        {(showAddModal || editingCategory) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Adı
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Kategori adını girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İkon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="🍎"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Kategori açıklaması"
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
                    {editingCategory ? 'Güncelle' : 'Ekle'}
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

export default AdminCategories;
