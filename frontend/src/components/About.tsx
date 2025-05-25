
const About = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-7">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <span className="text-6xl mr-4"></span>
              <h1 className="text-5xl font-bold text-gray-800">
                Hakkımızda 
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Organik Köşe, doğanın sunduğu en saf ve katkısız lezzetleri sofralarınıza ulaştırmak amacıyla kurulmuş bir aile girişimidir. El yapımı sirke, marmelat, pekmez ve daha birçok doğal ürünle, geleneksel yöntemlerle üretilen sağlıklı alternatifleri sizlere sunmaktan mutluluk duyuyoruz.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Modern yaşamın getirdiği hızlı tüketime karşı, yavaş, bilinçli ve doğal üretimi savunuyoruz. Her bir ürünümüzü:
              </p>

              <ul className="text-gray-700 text-lg leading-relaxed mb-6 list-disc pl-6">
                <li>Mevsiminde toplanan meyve ve sebzelerden,</li>
                <li>Katkı maddesi içermeden,</li>
                <li>Hijyenik koşullarda ve el emeğiyle</li>
              </ul>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                hazırlıyoruz.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                Amacımız yalnızca ürün satmak değil; aynı zamanda doğaya saygılı, sürdürülebilir ve sağlıklı bir yaşam tarzını yaymak. Bu nedenle ürünlerimizin içeriklerini şeffaf bir şekilde paylaşıyor, size ne yediğinizi ve nereden geldiğini anlatmak istiyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
