
import { Card, CardContent } from "@/components/ui/card";

const AboutTrolls = () => {
  return (
    <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            Meet the Trolls 🧌
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            We're not your typical internet trolls. We're the guardians of digital freedom, 
            ancient wisdom keepers who've adapted to the modern world.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🌉</div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-3">Bridge Builders</h3>
              <p className="text-gray-700">
                We don't just live under bridges - we build them! Creating connections between 
                privacy tools, communities, and knowledge.
              </p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-teal-50 to-emerald-100 border-teal-200">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-3">Secret Keepers</h3>
              <p className="text-gray-700">
                Masters of ancient encryption magic and modern cryptography. Your secrets 
                are safe in our mystical vaults.
              </p>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-teal-100 border-green-200">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold text-emerald-800 mb-3">Digital Warriors</h3>
              <p className="text-gray-700">
                Fighting censorship and surveillance with code, creativity, and community. 
                We protect the realm of free expression.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutTrolls;
