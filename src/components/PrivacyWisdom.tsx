
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Wifi, MessageSquare, Eye } from "lucide-react";

const PrivacyWisdom = () => {
  const wisdomItems = [
    {
      icon: Lock,
      title: "Encryption Spells",
      description: "Learn the ancient art of scrambling your messages so only the intended recipient can read them. From PGP to Signal, we'll teach you the runes!",
      tips: ["Use end-to-end encryption for sensitive communications", "Generate strong, unique passwords for each account", "Enable two-factor authentication everywhere possible"]
    },
    {
      icon: Wifi,
      title: "VPN Tunnels",
      description: "Navigate the digital realm through our secure tunnels. Hide your tracks from prying eyes and access the free internet from anywhere.",
      tips: ["Choose a VPN with a no-logs policy", "Use servers in privacy-friendly jurisdictions", "Always verify your IP has changed after connecting"]
    },
    {
      icon: MessageSquare,
      title: "Anonymous Communication",
      description: "Speak freely without fear. Discover tools and techniques for communicating without revealing your identity to censors.",
      tips: ["Use Tor browser for anonymous web browsing", "Try decentralized messaging platforms", "Learn about burner devices and accounts"]
    },
    {
      icon: Eye,
      title: "Surveillance Resistance",
      description: "Protect yourself from the all-seeing eye. Understand how data collection works and how to minimize your digital footprint.",
      tips: ["Regular digital detox and data audits", "Use privacy-focused search engines", "Block trackers with browser extensions"]
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-emerald-100 to-teal-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-6">
            Ancient Privacy Wisdom 📜
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Centuries of troll knowledge adapted for the digital age. Learn to protect yourself 
            and others in the vast wilderness of the internet.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {wisdomItems.map((item, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-emerald-800">
                  <item.icon className="w-8 h-8 mr-3 text-emerald-600" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{item.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-emerald-800">Troll Tips:</h4>
                  <ul className="space-y-1">
                    {item.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start text-sm text-gray-600">
                        <span className="text-emerald-600 mr-2">🔹</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrivacyWisdom;
