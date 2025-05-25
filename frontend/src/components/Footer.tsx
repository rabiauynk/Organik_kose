
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl">🌿</div>
              <span className="text-xl font-bold">Organik Köşe</span>
            </div>
            <p className="text-gray-300 mb-4">
              Doğal, organik ve ev yapımı lezzetlerle sağlıklı yaşamın adresi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">Ürünler</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">Hakkımızda</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">İletişim</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=Sirke" className="text-gray-300 hover:text-white transition-colors">Sirke</Link></li>
              <li><Link to="/products?category=Marmelat" className="text-gray-300 hover:text-white transition-colors">Marmelat</Link></li>
              <li><Link to="/products?category=Pekmez" className="text-gray-300 hover:text-white transition-colors">Pekmez</Link></li>
              <li><Link to="/products?category=Bal" className="text-gray-300 hover:text-white transition-colors">Bal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">İstanbul, Türkiye</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">+90 555 123 45 67</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">info@organikkose.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Organik Köşe. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
