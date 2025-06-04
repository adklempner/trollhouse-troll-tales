
import { Shield, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 opacity-50"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-emerald-400 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-teal-300 rounded-full opacity-25"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-emerald-800 mb-4">
            🧌 Trollhouse
          </h1>
          <p className="text-2xl md:text-3xl text-emerald-700 font-medium mb-6">
            Where Trolls Unite for Digital Freedom
          </p>
        </div>
        
        <div className="mb-12 animate-fade-in delay-200">
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Welcome to our mystical community! We're trolls who believe in protecting your digital rights, 
            fighting censorship, and building bridges (not just living under them) to a more private internet.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in delay-400">
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Shield className="w-5 h-5 text-emerald-600 mr-2" />
            <span className="text-emerald-800 font-medium">Privacy First</span>
          </div>
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Users className="w-5 h-5 text-emerald-600 mr-2" />
            <span className="text-emerald-800 font-medium">Community Driven</span>
          </div>
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Eye className="w-5 h-5 text-emerald-600 mr-2" />
            <span className="text-emerald-800 font-medium">Censorship Resistant</span>
          </div>
        </div>
        
        <div className="animate-fade-in delay-600">
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Join Our Tribe 🌉
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
