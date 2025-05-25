
import { ArrowRight, Heart, Shield, Star, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Category } from '../services/api';

interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
}

interface CategoryWithCount extends Category {
  count: number;
}

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load products and categories from backend
        const [apiProducts, apiCategories] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories()
        ]);

        // Convert API products to featured products (take first 4)
        const featured: FeaturedProduct[] = apiProducts.slice(0, 4).map(product => ({
          id: product.id,
          name: product.isim,
          price: product.fiyat,
          image: product.resimUrl || '/placeholder.svg',
          rating: 4.5 + Math.random() * 0.5, // Mock rating for now
          description: product.açıklama
        }));

        // Convert API categories to categories with count
        const categoriesWithCount: CategoryWithCount[] = apiCategories.map(category => ({
          ...category,
          count: apiProducts.filter(product => product.categoryId === category.id).length
        }));

        setFeaturedProducts(featured);
        setCategories(categoriesWithCount);
      } catch (error) {
        console.error('Failed to load homepage data:', error);

        // Fallback to mock data
        const mockFeatured: FeaturedProduct[] = [
          {
            id: 1,
            name: 'Elma Sirkesi',
            price: 45.00,
            image: 'https://picsum.photos/400/400?random=1',
            rating: 4.9,
            description: 'Ev yapımı doğal elma sirkesi'
          },
          {
            id: 2,
            name: 'Çilek Marmelatı',
            price: 35.00,
            image: 'https://picsum.photos/400/400?random=2',
            rating: 4.8,
            description: 'Taze çileklerden yapılmış doğal marmelat'
          },
          {
            id: 3,
            name: 'Dut Pekmezi',
            price: 65.00,
            image: 'https://picsum.photos/400/400?random=3',
            rating: 4.9,
            description: 'Geleneksel yöntemlerle üretilmiş dut pekmezi'
          },
          {
            id: 4,
            name: 'Lavanta Balı',
            price: 85.00,
            image: 'https://picsum.photos/400/400?random=4',
            rating: 5.0,
            description: 'Saf lavanta balı, doğal ve organik'
          }
        ];

        const mockCategories: CategoryWithCount[] = [
          { id: 1, name: 'Sirke', description: 'Doğal sirkeler', icon: '🍎', aktif: true, createdAt: '', count: 8 },
          { id: 2, name: 'Marmelat', description: 'Ev yapımı marmelatlar', icon: '🍓', aktif: true, createdAt: '', count: 12 },
          { id: 3, name: 'Pekmez', description: 'Geleneksel pekmezler', icon: '🍇', aktif: true, createdAt: '', count: 6 },
          { id: 4, name: 'Bal', description: 'Doğal ballar', icon: '🍯', aktif: true, createdAt: '', count: 10 },
          { id: 5, name: 'Turşu', description: 'Ev yapımı turşular', icon: '🥒', aktif: true, createdAt: '', count: 15 },
          { id: 6, name: 'Reçel', description: 'Mevsim reçelleri', icon: '🫐', aktif: true, createdAt: '', count: 9 }
        ];

        setFeaturedProducts(mockFeatured);
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Doğanın En Saf
                <span className="text-green-700 block">Lezzetleri</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Organik Köşe'de ev yapımı, doğal ve katkısız ürünler ile sağlıklı yaşamın kapılarını açıyoruz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-all duration-300 flex items-center justify-center group"
                >
                  Ürünleri Keşfet
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300"
                >
                  Hikayemiz
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-green-400 to-amber-400 rounded-3xl p-8 transform rotate-3 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 transform -rotate-3">
                  <img
                    src="https://picsum.photos/600/400?random=hero"
                    alt="Doğal ürünler"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">%100 Doğal</h3>
              <p className="text-gray-600 text-sm">Hiçbir kimyasal katkı madde kullanmıyoruz</p>
            </div>
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Güvenli Ödeme</h3>
              <p className="text-gray-600 text-sm">256-bit SSL ile güvenli alışveriş</p>
            </div>
            <div className="text-center group">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-200 transition-colors">
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600 text-sm">2-3 iş günü içinde kapınızda</p>
            </div>
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Kalite Garantisi</h3>
              <p className="text-gray-600 text-sm">Memnun kalmazsanız geri iade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Kategorilerimiz</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Geleneksel yöntemlerle üretilmiş, doğal ve ev yapımı lezzetlerimizi keşfedin
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 text-center animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                </div>
              ))
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.name}`}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
                  <p className="text-gray-500 text-sm">{category.count} ürün</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En sevilen ve kaliteli ürünlerimizi inceleyin
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">₺{product.price.toFixed(2)}</span>
                      <Link
                        to={`/products/${product.id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
                      >
                        Detay
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition-colors inline-flex items-center"
            >
              Tüm Ürünleri Gör
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Özel Fırsatlardan Haberdar Olun</h2>
          <p className="text-green-100 mb-8 text-lg">
            Yeni ürünler ve indirimlerden ilk sizin haberiniz olsun
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Abone Ol
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
