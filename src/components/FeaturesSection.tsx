import { Card } from "@/components/ui/card";
import { 
  Store, 
  Ticket, 
  Clock, 
  CreditCard, 
  Users, 
  BarChart, 
  Bell, 
  Smartphone,
  ShieldCheck,
  Zap
} from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Pre-order from Any Campus Store",
    description: "Choose from all participating campus food outlets and place your order in advance."
  },
  {
    icon: Ticket,
    title: "Digital Ticket System",
    description: "Receive a unique ticket number for easy order pickup and tracking."
  },
  {
    icon: Clock,
    title: "Flexible Collection Times",
    description: "Select your preferred pickup time within store operating hours."
  },
  {
    icon: CreditCard,
    title: "Student Voucher Support",
    description: "Seamlessly use your student meal vouchers for catered students."
  },
  {
    icon: BarChart,
    title: "Store Management Platform",
    description: "Dedicated interface for stores to manage and track daily orders efficiently."
  },
  {
    icon: Smartphone,
    title: "User-Friendly Interface",
    description: "Intuitive design optimized for both students and staff members."
  },
  {
    icon: Zap,
    title: "Real-Time Order Updates",
    description: "Stay informed with live status updates on your order progress."
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment Integration",
    description: "Safe and reliable payment processing with multiple options."
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get notified when your order is ready for pickup."
  },
  {
    icon: BarChart,
    title: "Analytics Dashboard",
    description: "Comprehensive insights and reporting tools for store owners."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Everything You Need for
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Seamless Food Ordering
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform streamlines the entire food ordering experience 
            for students, staff, and store managers alike.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 bg-gradient-card border border-border shadow-crisp hover:shadow-elevation transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-gradient-primary shadow-soft">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;