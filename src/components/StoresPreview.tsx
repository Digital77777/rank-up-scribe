import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, MapPin } from "lucide-react";
import campusStoreImage from "@/assets/campus-store.jpg";

const stores = [
  {
    name: "Campus Grill",
    category: "American",
    rating: 4.8,
    prepTime: "15-20 min",
    location: "Student Union Building",
    image: campusStoreImage,
    specialties: ["Burgers", "Wraps", "Salads"],
    isOpen: true
  },
  {
    name: "Asia Fusion",
    category: "Asian",
    rating: 4.9,
    prepTime: "10-15 min", 
    location: "Library Plaza",
    image: campusStoreImage,
    specialties: ["Noodles", "Rice Bowls", "Sushi"],
    isOpen: true
  },
  {
    name: "Healthy Bites",
    category: "Healthy",
    rating: 4.7,
    prepTime: "8-12 min",
    location: "Sports Complex",
    image: campusStoreImage,
    specialties: ["Smoothies", "Protein Bowls", "Wraps"],
    isOpen: false
  }
];

const StoresPreview = () => {
  return (
    <section id="stores" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Popular Campus Stores
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover amazing food options from our participating campus stores. 
            Each store offers unique specialties and convenient pickup times.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stores.map((store, index) => (
            <Card key={index} className="overflow-hidden bg-background border-0 shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={store.image}
                  alt={`${store.name} interior`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={store.isOpen ? "default" : "secondary"} className="bg-gradient-primary text-primary-foreground">
                    {store.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {store.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground">{store.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-food-orange text-food-orange" />
                    <span className="text-sm font-medium text-foreground">{store.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{store.prepTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{store.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {store.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={!store.isOpen}
                >
                  {store.isOpen ? "View Menu" : "Currently Closed"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Stores
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StoresPreview;