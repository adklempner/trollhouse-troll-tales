
import { Card, CardContent } from "@/components/ui/card";

const CommunityValues = () => {
  const values = [
    {
      emoji: "🤝",
      title: "Mutual Aid",
      description: "We help each other navigate the digital world safely. No troll left behind in the surveillance state!"
    },
    {
      emoji: "🔓",
      title: "Open Source",
      description: "Our tools and knowledge are shared freely. Transparency is the foundation of trust in our community."
    },
    {
      emoji: "🌍",
      title: "Global Solidarity",
      description: "From trolls under Nordic bridges to those in digital caves worldwide, we stand together for freedom."
    },
    {
      emoji: "📚",
      title: "Education First",
      description: "Knowledge is power. We believe in teaching others to fish (and encrypt) rather than doing it for them."
    },
    {
      emoji: "🎭",
      title: "Anonymity Respected",
      description: "Your identity is yours to share or protect. We welcome all trolls, named or anonymous."
    },
    {
      emoji: "⚖️",
      title: "Ethical Technology",
      description: "We promote tools and practices that respect human rights and dignity, not exploit them."
    }
  ];

  return (
    <section className="py-20 px-4 bg-white/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            Our Troll Code 📋
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            These values guide our community and shape how we approach digital privacy, 
            censorship resistance, and building a better internet for everyone.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-emerald-50 border-emerald-200">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{value.emoji}</div>
                <h3 className="text-xl font-bold text-emerald-800 mb-3">{value.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-emerald-600 text-white rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Tribe? 🧌</h3>
            <p className="mb-6">
              Whether you're a seasoned privacy advocate or just starting your journey into digital freedom, 
              there's a place for you in the Trollhouse community.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-emerald-200">
              <span>🔐 Learn Privacy Tools</span>
              <span>🤝 Share Knowledge</span>
              <span>🛡️ Fight Censorship</span>
              <span>🌉 Build Bridges</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityValues;
