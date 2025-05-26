
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { apiService, Category } from '../services/api';

interface ProductUI {
  id: string;
  isim: string;
  fiyat: number;
  resim_url: string;
  açıklama: string;
  fullDescription?: string; // Additional UI field
  kategori_id: string;
  stok: number;
  features?: string[]; // Additional UI field
  categoryName?: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductUI | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProductData = async () => {
      if (!id) {
        setError('Ürün ID bulunamadı');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load product and categories from backend
        const [apiProduct, apiCategories] = await Promise.all([
          apiService.getProductById(parseInt(id)),
          apiService.getCategories()
        ]);

        // Convert API product to UI product
        const productUI: ProductUI = {
          id: apiProduct.id.toString(),
          isim: apiProduct.isim,
          fiyat: apiProduct.fiyat,
          resim_url: apiProduct.resimUrl || 'https://picsum.photos/400/400?random=' + apiProduct.id,
          açıklama: apiProduct.açıklama,
          fullDescription: apiProduct.açıklama + ' Bu ürün geleneksel yöntemlerle üretilmiş olup, doğal ve organik içeriğe sahiptir.',
          kategori_id: apiProduct.categoryId.toString(),
          stok: apiProduct.stok,
          categoryName: apiProduct.categoryName,
          features: [
            '%100 Doğal ve Organik',
            'Hiçbir Kimyasal Katkı Yok',
            'Geleneksel Üretim',
            'Kalite Garantili',
            'Hijyenik Ambalaj'
          ]
        };

        setProduct(productUI);
        setCategories(apiCategories);
      } catch (error) {
        console.error('Failed to load product:', error);
        setError('Ürün yüklenirken hata oluştu');

        // Fallback to mock data
        const mockProduct: ProductUI = {
          id: id || '1',
          isim: 'Elma Sirkesi',
          fiyat: 45.00,
          resim_url: 'https://picsum.photos/400/400?random=1',
          açıklama: 'Ev yapımı doğal elma sirkesi, fermentasyon ile üretilmiştir.',
          fullDescription: 'Geleneksel yöntemlerle üretilen 100% doğal elma sirkesi. Hiçbir kimyasal katkı maddesi kullanılmadan, organik elmalardan fermentasyon yöntemiyle elde edilmiştir.',
          kategori_id: '1',
          stok: 25,
          categoryName: 'Sirke',
          features: [
            '%100 Doğal ve Organik',
            'Hiçbir Kimyasal Katkı Yok',
            'Geleneksel Fermentasyon',
            'Probiyotik Açısından Zengin',
            'Cam Şişe Ambalaj',
            '500ml'
          ]
        };
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id.toString() === categoryId);
    return category ? category.name : product?.categoryName || 'Diğer';
  };

  // Generate multiple images from the main image
  const images = product ? [
    product.resim_url,
    product.resim_url,
    product.resim_url
  ] : [];

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.isim,
          price: product.fiyat,
          image: product.resim_url
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Ürün Bulunamadı</h2>
          <p className="text-gray-600 mb-6">{error || 'Aradığınız ürün mevcut değil.'}</p>
          <Link
            to="/products"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Ürünlere Dön
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
              <img
                src={images[selectedImage]}
                alt={product.isim}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-white rounded-lg overflow-hidden shadow-md transition-all ${
                    selectedImage === index ? 'ring-2 ring-green-600' : 'hover:shadow-lg'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-2">
                  {getCategoryName(product.kategori_id)}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.isim}</h1>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-green-600">₺{product.fiyat.toFixed(2)}</span>
                <p className="text-gray-600 mt-2">{product.açıklama}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stok > 0 ? (
                  <div className="flex items-center text-green-600">
                    <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                    <span>Stokta {product.stok} adet mevcut</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                    <span>Stokta yok</span>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              {product.stok > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-gray-700 font-medium">Adet:</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stok, quantity + 1))}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-medium"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Sepete Ekle - ₺{(product.fiyat * quantity).toFixed(2)}</span>
                  </button>
                </div>
              )}

              {/* Features */}
              {product.features && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Ürün Özellikleri</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ürün Açıklaması</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{product.fullDescription || product.açıklama}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
