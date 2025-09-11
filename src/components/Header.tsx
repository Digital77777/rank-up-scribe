import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, ShoppingCart, LogOut, Home, Store, Clock, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Foodie-U
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/stores')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Stores
            </button>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
              How It Works
            </a>
            <button 
              onClick={() => navigate('/orders')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Orders
            </button>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            )}
            
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="hidden md:inline-block text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="outline" onClick={handleAuthClick}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={handleAuthClick}>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-foreground">F</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      Foodie-U
                    </span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start text-left"
                    onClick={() => {
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Home className="w-4 h-4 mr-3" />
                    Home
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start text-left"
                    onClick={() => {
                      navigate('/stores');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Store className="w-4 h-4 mr-3" />
                    Stores
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start text-left"
                    onClick={() => {
                      navigate('/orders');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Clock className="w-4 h-4 mr-3" />
                    Orders
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start text-left"
                    onClick={() => {
                      const element = document.getElementById('how-it-works');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                      setMobileMenuOpen(false);
                    }}
                  >
                    <HelpCircle className="w-4 h-4 mr-3" />
                    How It Works
                  </Button>
                  
                  {user && (
                    <Button 
                      variant="ghost" 
                      className="justify-start text-left"
                      onClick={() => {
                        navigate('/cart');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-3" />
                      Cart {itemCount > 0 && `(${itemCount})`}
                    </Button>
                  )}
                  
                  <div className="border-t pt-4 mt-6">
                    {user ? (
                      <div className="space-y-4">
                        <div className="text-sm text-muted-foreground px-3">
                          {user.email}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            handleAuthClick();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          handleAuthClick();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Sign In
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;