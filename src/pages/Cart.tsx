import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useStores } from '@/hooks/useStores';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, updateQuantity, removeItem, clearCart, storeId } = useCart();
  const { stores } = useStores();
  const { toast } = useToast();
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const store = stores.find(s => s.id === storeId);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to place an order.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    
    // TODO: Implement order creation logic here
    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: `Your order from ${store?.name} has been placed. You'll receive a confirmation shortly.`,
      });
      clearCart();
      navigate('/orders');
      setIsProcessing(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate('/stores')}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stores
            </Button>

            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <CardTitle className="mb-2">Your cart is empty</CardTitle>
                <CardDescription className="mb-6">
                  Add some delicious items from our campus stores to get started
                </CardDescription>
                <Button onClick={() => navigate('/stores')}>
                  Browse Stores
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(`/store/${storeId}`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {store?.name || 'Store'}
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Order</CardTitle>
                  <CardDescription>
                    From {store?.name} • {store?.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          <p className="text-sm font-medium">${item.price.toFixed(2)} each</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">${item.subtotal.toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Special Instructions (Optional)</label>
                    <Textarea
                      placeholder="Any special requests for your order..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90"
                      onClick={handleCheckout}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our terms and conditions
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;