
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Mohamed Zouari",
      role: "Directeur Financier",
      company: "TechStart",
      image: "/lovable-uploads/71b93732-45ea-4330-96cf-7bff5ea4f99a.png",
      quote: "Trézo a révolutionné notre gestion de trésorerie. Nous avons réduit nos délais de reporting de 80% et amélioré notre visibilité financière.",
      rating: 5
    },
    {
      name: "Yacine Chiha",
      role: "CEO",
      company: "InnovCorp",
      image: "/lovable-uploads/71b93732-45ea-4330-96cf-7bff5ea4f99a.png",
      quote: "L'interface intuitive et les prévisions intelligentes nous permettent d'anticiper nos besoins de financement avec une précision remarquable.",
      rating: 5
    },
    {
      name: "Slim Hassine",
      role: "Contrôleur de Gestion",
      company: "GrowthSAS",
      image: "/lovable-uploads/71b93732-45ea-4330-96cf-7bff5ea4f99a.png",
      quote: "Le support client est exceptionnel et les fonctionnalités d'analyse nous aident à prendre des décisions stratégiques basées sur des données fiables.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ce que disent nos clients
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment Trézo aide les entreprises à optimiser leur gestion financière
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              {/* Rating */}
              <div className="flex mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
