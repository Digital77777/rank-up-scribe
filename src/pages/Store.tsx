import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, MapPin, Plus, ShoppingCart } from 'lucide-react';
import { useStores, useStoreMenu } from '@/hooks/useStores';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

const Store = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { stores } = useStores();
  const { menuItems, categories, loading, error } = useStoreMenu(storeId || null);
  const { addItem, itemCount } = useCart();
  const { toast } = useToast();

  const store = stores.find(s => s.id === storeId);

  const handleAddToCart = (item: any) => {
    try {
      addItem(item);
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Cannot add item",
        description: "You can only order from one store at a time.",
        variant: "destructive",
      });
    }
  };

  const groupedItems = categories.reduce((acc, category) => {
    acc[category.name] = menuItems.filter(item => item.category?.name === category.name);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  // Add uncategorized items
  const uncategorizedItems = menuItems.filter(item => !item.category);
  if (uncategorizedItems.length > 0) {
    groupedItems['Other'] = uncategorizedItems;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/stores')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stores
          </Button>
          <div className="text-center">Loading menu...</div>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/stores')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stores
          </Button>
          <div className="text-center text-destructive">
            {error || 'Store not found'}
          </div>
        </div>
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
            onClick={() => navigate('/stores')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stores
          </Button>

          {/* Store Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                {store.image_url && (
                  <div className="w-full md:w-32 h-48 md:h-32 rounded-lg overflow-hidden">
                    <img
                      src={store.image_url}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl">{store.name}</CardTitle>
                    <Badge variant="secondary">Open</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    {store.location}
                  </CardDescription>
                  {store.description && (
                    <p className="text-muted-foreground mb-4">{store.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>15-30 min</span>
                    </div>
                    {store.phone && (
                      <span>{store.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Menu */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue={Object.keys(groupedItems)[0]} className="w-full">
                <TabsList className="grid w-full grid-cols-auto">
                  {Object.keys(groupedItems).map(category => (
                    <TabsTrigger key={category} value={category} className="text-sm">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(groupedItems).map(([category, items]) => (
                  <TabsContent key={category} value={category} className="mt-6">
                    <div className="space-y-4">
                      {items.map(item => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">{item.name}</h3>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <span>{item.preparation_time} min</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="font-semibold text-lg">
                                    ${item.price.toFixed(2)}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddToCart(item)}
                                  className="bg-gradient-primary hover:opacity-90"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {items.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No items available in this category
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Your Order ({itemCount})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {itemCount === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Your cart is empty
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <Button 
                        className="w-full bg-gradient-primary hover:opacity-90"
                        onClick={() => navigate('/cart')}
                      >
                        View Cart & Checkout
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Store;