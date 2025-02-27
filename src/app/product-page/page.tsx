"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ProductData } from "@/interfaces/interfaces";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<ProductData | undefined>(undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { products, fetchProducts } = useProductStore();
  const { addItemToCart, openCartModal } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (products.length > 0 && productId) {
        const selectedProduct = products.find(
          (product: ProductData) => product.product_id.toString() === productId
        );
        setProduct(selectedProduct);
        setIsLoading(false);
      } else {
        await fetchProducts();
      }
    };

    loadProduct();
  }, [products, productId]);

  const handleAddItemToCart = (product: ProductData | undefined): void => {
    if (!product) return;
    addItemToCart(product);
    openCartModal();
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!product) return;
    
    const lastIndex = product.image_urls.length - 1;
    if (direction === 'prev') {
      setCurrentImageIndex(current => current === 0 ? lastIndex : current - 1);
    } else {
      setCurrentImageIndex(current => current === lastIndex ? 0 : current + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size={40} className="text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Продукт не найден</h2>
        <Button 
          onClick={() => router.push('/')}
          className="mt-4 bg-primary hover:bg-primary-700"
        >
          Вернуться к покупкам
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square">
            <img
              src={product.image_urls[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {product.image_urls.length > 1 && (
              <>
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-primary" />
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-primary" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {product.image_urls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.image_urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all
                    ${currentImageIndex === index ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                >
                  <img
                    src={url}
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">{product.price} руб</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center">
            {product.inStock ? (
              <span className="text-green-600 font-medium flex items-center">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                В наличии
              </span>
            ) : (
              <span className="text-red-600 font-medium flex items-center">
                <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                Нет в наличии
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Characteristics */}
          {/* {product.characteristics && product.characteristics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Характеристики</h3>
              <div className="grid gap-2">
                {product.characteristics.map((char, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                    <span className="text-gray-600">{char.name}</span>
                    <span className="text-gray-900">{char.value} {char.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary-700"
              onClick={() => handleAddItemToCart(product)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              В корзину
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Additional Info */}
          {product.minimum_order_quantity && product.minimum_order_quantity > 1 && (
            <p className="text-sm text-gray-500">
              Минимальный заказ: {product.minimum_order_quantity} шт.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
