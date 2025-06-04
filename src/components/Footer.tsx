
import { Heart, Shield, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-emerald-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              🧌 Trollhouse
            </h3>
            <p className="text-emerald-200 leading-relaxed">
              A community of digital privacy advocates disguised as mythical creatures. 
              We believe everyone deserves freedom from surveillance and censorship.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy Resources
            </h4>
            <ul className="space-y-2 text-emerald-200">
              <li>🔐 Encryption Guides</li>
              <li>🌐 VPN Recommendations</li>
              <li>📱 Secure Apps Directory</li>
              <li>🛡️ Digital Security Tips</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Community
            </h4>
            <ul className="space-y-2 text-emerald-200">
              <li>💬 Discussion Forums</li>
              <li>📚 Knowledge Base</li>
              <li>🎓 Privacy Workshops</li>
              <li>🤝 Volunteer Opportunities</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-emerald-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-emerald-200 mb-4 md:mb-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-2 text-red-400" />
              <span>by trolls for digital freedom</span>
            </div>
            <div className="text-emerald-200 text-sm">
              © 2024 Trollhouse Community • Privacy-First • Censorship-Resistant
            </div>
          </div>
          
          <div className="mt-4 text-center text-emerald-300 text-sm">
            <p>🌉 Remember: We build bridges, not walls. Knowledge shared is freedom multiplied. 🌉</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
