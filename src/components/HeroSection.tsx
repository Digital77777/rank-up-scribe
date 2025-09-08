import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-food.jpg";
import { Clock, Ticket, Users, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Delicious campus food spread"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
          Skip the Line,<br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Savor the Time
          </span>
        </h1>
        
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-white/90 leading-relaxed">
          Pre-order your favorite campus meals and collect them at your convenience. 
          No more waiting in long queues during busy hours!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
          <Button variant="hero" size="lg" className="text-base px-10 py-4 h-14 font-semibold">
            Start Ordering Now
          </Button>
          <Button variant="outline-hero" size="lg" className="text-base px-10 py-4 h-14 font-semibold">
            Browse Stores
          </Button>
        </div>
        
        {/* Quick Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <Clock className="w-8 h-8 mb-2 text-food-orange" />
            <span className="text-sm font-medium">Skip Waiting</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <Ticket className="w-8 h-8 mb-2 text-food-orange" />
            <span className="text-sm font-medium">Digital Tickets</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <Users className="w-8 h-8 mb-2 text-food-orange" />
            <span className="text-sm font-medium">Student Vouchers</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
            <Shield className="w-8 h-8 mb-2 text-food-orange" />
            <span className="text-sm font-medium">Secure Payments</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;