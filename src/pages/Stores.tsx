import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, MapPin, Search } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const Stores = () => {
  const { stores, loading, error } = useStores();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center">Loading stores...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="text-center text-destructive">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Campus Food Stores</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover delicious meals from approved campus vendors
            </p>
            
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search stores or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredStores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {searchTerm ? 'No stores found matching your search.' : 'No stores available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store) => (
                <Card key={store.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {store.image_url && (
                      <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                        <img
                          src={store.image_url}
                          alt={store.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardTitle className="flex items-center justify-between">
                      {store.name}
                      <Badge variant="secondary">Open</Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {store.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {store.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {store.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>15-30 min</span>
                      </div>
                      
                      <Button 
                        onClick={() => navigate(`/store/${store.id}`)}
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        View Menu
                      </Button>
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

export default Stores;