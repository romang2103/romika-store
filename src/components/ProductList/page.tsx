'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeartIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProductList } from './action';
import { useCartStore } from '@/store/useCartStore';
import { ProductData } from '@/interfaces/interfaces';
import { useFilterStore } from '@/store/useFilterStore';
import { useSearchParams } from 'next/navigation'

export default function ProductList() {
  const searchParams = useSearchParams();

  const page = searchParams.get('page') ?? 1;
  const PRODUCTS_PER_PAGE = 10;
  
  const start = (Number(page) - 1) * PRODUCTS_PER_PAGE;


  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addItemToCart, openCartModal } = useCartStore();
  const { Filters } = useFilterStore();

  useEffect(() => {
     async function loadProducts() {
      try {
        const data = await getProductList(Filters);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [Filters]);

  const handleAddItemToCart = async (product: ProductData) => {
    await addItemToCart(product);
    openCartModal();
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.product_id} className="bg-white rounded-lg shadow-md">
          <CardContent className="p-4">
            <img
              src={product.image_urls[0]}
              alt={product.name}
              className="w-full h-64 md:h-80 lg:h-96 object-cover mb-4 rounded-md"
            />
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                {/* <p className="text-gray-600">{product.description}</p> */}
                <p className="mt-2 text-xl font-bold">{product.price} rub</p>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
                    product.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Button variant="outline" size="icon" className="text-gray-500 hover:text-red-500">
                  <HeartIcon className="w-5 h-5" />
                  <span className="sr-only">Like</span>
                </Button>
                <Button size="sm" onClick={() => handleAddItemToCart(product)}>Add to Cart</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
