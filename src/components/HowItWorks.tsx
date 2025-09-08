import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Clock, CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Browse & Choose",
    description: "Explore participating campus food stores and browse their delicious menus."
  },
  {
    step: "02", 
    icon: ShoppingCart,
    title: "Order & Pay",
    description: "Add items to cart, select pickup time, and complete secure payment with vouchers if eligible."
  },
  {
    step: "03",
    icon: Clock,
    title: "Get Your Ticket",
    description: "Receive a unique digital ticket number and pickup time confirmation via app notification."
  },
  {
    step: "04",
    icon: CheckCircle,
    title: "Skip & Collect",
    description: "Head to the store at your scheduled time, show your ticket, and collect your fresh meal!"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Getting your favorite campus meal is easier than ever with our simple 4-step process
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent z-0" />
              )}
              
              <Card className="relative z-10 p-6 text-center bg-gradient-card border-0 shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-food-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button size="lg" className="text-lg px-8 py-6">
            Start Your First Order
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;