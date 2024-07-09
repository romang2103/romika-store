import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeartIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

  interface Product {
    id: number;
    imageUrl: string;
    name: string;
    description: string;
    price: number;
    inStock: boolean;
  }

  interface ProductListProps {
    products: Product[];
  }

  export default function ProductList({ products }: ProductListProps) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="bg-white rounded-lg shadow-md">
            <CardContent className="p-4">
              <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mb-4 rounded-md" />
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="mt-2 text-xl font-bold">{product.price} rub</p>
                  <span className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${product.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Button variant="outline" size="icon" className="text-gray-500 hover:text-red-500">
                    <HeartIcon className="w-5 h-5" />
                    <span className="sr-only">Like</span>
                  </Button>
                  <Button size="sm">Add to Cart</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }