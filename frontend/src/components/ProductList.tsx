
import { Filter, SlidersHorizontal, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Product, apiService } from '../services/api';

interface ProductUI extends Product {
  rating: number; // For UI display purposes
}

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductUI[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('isim');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const apiProducts = await apiService.getProducts();
        // Convert API products to UI products with rating
        const productsWithRating: ProductUI[] = apiProducts.map(product => ({
          ...product,
          id: product.id.toString(),
          resim_url: product.resimUrl || '/placeholder.svg',
          kategori_id: product.categoryId.toString(),
          rating: 4.5 + Math.random() * 0.5 // Mock rating for now
        }));
        setProducts(productsWithRating);

        // Apply search filter from URL
        const searchQuery = searchParams.get('search');
        const categoryQuery = searchParams.get('category');

        if (categoryQuery) {
          setSelectedCategory(categoryQuery);
        }

        filterProducts(productsWithRating, categoryQuery || '', searchQuery || '');
      } catch (error) {
        console.error('Failed to load products:', error);
        // Fallback to mock data
        const mockProducts: ProductUI[] = [
          {
            id: '1',
            isim: 'Elma Sirkesi',
            fiyat: 45.00,
            açıklama: 'Ev yapımı doğal elma sirkesi, fermentasyon ile üretilmiştir.',
            resimUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop',
            stok: 25,
            aktif: true,
            categoryId: 1,
            categoryName: 'Sirke',
            resim_url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop',
            kategori_id: '1',
            rating: 4.9
          }
        ];
        setProducts(mockProducts);
        filterProducts(mockProducts, '', '');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [searchParams]);

  // Mock categories data matching with kategori_id
  const categories = [
    { id: '', name: 'Tümü' },
    { id: '1', name: 'Sirke' },
    { id: '2', name: 'Marmelat' },
    { id: '3', name: 'Pekmez' },
    { id: '4', name: 'Bal' },
    { id: '5', name: 'Turşu' },
    { id: '6', name: 'Reçel' }
  ];

  const filterProducts = (allProducts: ProductUI[], category: string, search: string) => {
    let filtered = allProducts;

    if (category && category !== '') {
      filtered = filtered.filter(product => product.kategori_id === category);
    }

    if (search) {
      filtered = filtered.filter(product =>
        product.isim.toLowerCase().includes(search.toLowerCase()) ||
        product.açıklama.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.fiyat - b.fiyat;
        case 'price-high':
          return b.fiyat - a.fiyat;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.isim.localeCompare(b.isim);
      }
    });

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const searchQuery = searchParams.get('search');
    filterProducts(products, categoryId, searchQuery || '');
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    const searchQuery = searchParams.get('search');
    filterProducts(products, selectedCategory, searchQuery || '');
  };

  const handleAddToCart = (product: ProductUI) => {
    addToCart({
      id: product.id.toString(),
      name: product.isim,
      price: product.fiyat,
      image: product.resim_url
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Diğer';
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Ürünlerimiz</h1>
          <p className="text-gray-600">Doğal ve ev yapımı lezzetlerimizi keşfedin</p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === category.id || (category.id === '' && !selectedCategory)
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and Filter Toggle */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="isim">İsme Göre</option>
                <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
                <option value="rating">Puana Göre</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtrele</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} ürün bulundu
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Ürünler yükleniyor...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.resim_url}
                  alt={product.isim}
                  className="w-full h-48 object-cover"
                />
                {product.stok === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Stokta Yok</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{product.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">{product.isim}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.açıklama}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">₺{product.fiyat}</span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {getCategoryName(product.kategori_id)}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
                  >
                    Detay
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stok === 0}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      product.stok > 0
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun ürün bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
