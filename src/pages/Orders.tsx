import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, MapPin, Receipt } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  pickup_time: string | null;
  special_instructions: string | null;
  created_at: string;
  store: {
    name: string;
    location: string;
  };
  order_items: Array<{
    quantity: number;
    unit_price: number;
    subtotal: number;
    food_item: {
      name: string;
      description: string | null;
    };
  }>;
}

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          pickup_time,
          special_instructions,
          created_at,
          store:stores(name, location),
          order_items(
            quantity,
            unit_price,
            subtotal,
            food_item:food_items(name, description)
          )
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast({
        title: "Error loading orders",
        description: "Failed to load your order history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'collected': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center">Loading your orders...</div>
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

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
            <p className="text-muted-foreground">Track your food orders and order history</p>
          </div>

          {orders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <CardTitle className="mb-2">No orders yet</CardTitle>
                <CardDescription className="mb-6">
                  You haven't placed any orders yet. Start by browsing our campus stores!
                </CardDescription>
                <Button onClick={() => navigate('/stores')}>
                  Browse Stores
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.order_number}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" />
                          {order.store.name} • {order.store.location}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {formatStatus(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.order_items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{item.quantity}x {item.food_item.name}</span>
                              {item.food_item.description && (
                                <p className="text-muted-foreground text-xs">{item.food_item.description}</p>
                              )}
                            </div>
                            <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Order Date</p>
                            <p className="font-medium">
                              {new Date(order.created_at).toLocaleDateString()} at{' '}
                              {new Date(order.created_at).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          
                          {order.pickup_time && (
                            <div>
                              <p className="text-muted-foreground">Pickup Time</p>
                              <p className="font-medium flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(order.pickup_time).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          )}
                          
                          <div>
                            <p className="text-muted-foreground">Total Amount</p>
                            <p className="font-semibold text-lg">${order.total_amount.toFixed(2)}</p>
                          </div>
                        </div>

                        {order.special_instructions && (
                          <div className="mt-4">
                            <p className="text-muted-foreground text-sm">Special Instructions</p>
                            <p className="text-sm">{order.special_instructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;