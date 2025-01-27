"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, CreditCard, Layout } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ProductData } from "@/interfaces/interfaces";
import { useProductStore } from "@/store/useProductStore";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");  

  const [product, setProduct] = useState<ProductData | undefined>(undefined);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const { products, fetchProducts, setProducts } = useProductStore();
  const { addItemToCart, openCartModal } = useCartStore();

  useEffect(() => {
    // Only search for the product if products array and productId are available
    console.log("useEffect");
    if (products.length > 0 && productId) {
      const selectedProduct = products.find(
        (product: ProductData) => product.product_id.toString() === productId
      );
      console.log("selectedProduct: ", selectedProduct);
      setProduct(selectedProduct);
    } else {    
      // Fetch products if products array is empty
      fetchProducts();
    }
  }, [products, productId]); // Depend on products and productId to update correctly

  // Prefetch checkout for smoother transition
  useEffect(() => {
    router.prefetch("/pages/checkout");
  }, []);
  

  function handleAddItemToCart(product: ProductData | undefined): void {
    if (!product) {
      console.error("No product to add to cart");
      return;
    }
    addItemToCart(product);
    openCartModal();
  }

  function handleBuyItemNow(product: ProductData | undefined): void {
    if (!product) {
      console.error("No product to add to cart");
      return;
    }
    addItemToCart(product);
    router.push("/pages/checkout");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="md:grid md:grid-cols-2 md:gap-8">
        <div className="space-y-8">
          {/* Product Images */}
          <section aria-label="Product images">
            <div className="mb-4">
              <Image
                src={product?.image_urls[currentImageIndex] ?? "/placeholder.svg"}
                alt={product?.name ?? "Product Image"}
                width={600}
                height={600}
                className="w-full md:max-w-md h-auto object-cover rounded-lg mx-auto border-solid border-2 border-black "
              />
            </div>
            <div
              className="flex space-x-2 overflow-x-auto pb-2 md:justify-center"
              role="region"
              aria-label="Product image thumbnails"
            >
              {product?.image_urls.map((src, index) => (
                <button
                  key={index}
                  className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md border-solid border-2 border-black"
                >
                  <Image
                    src={src}
                    alt={`Product Image - View ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md"
                    loading="lazy"
                    onClick={() => setCurrentImageIndex(index)}
                  />
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 md:mt-0 space-y-8">
          {/* Product Details */}
          <section aria-label="Product details">
            <h1 className="text-3xl font-bold mb-4">{product?.name ?? "Product Name"}</h1>
            <p className="text-2xl font-bold mb-4">{product ? `${product.price} руб` : "Price not available"}</p>
          </section>

          {/* Buy Now Section */}
          <section aria-label="Purchase options">
            <Card>
              <CardContent className="p-6">
                <p className="text-xl font-bold text-green-600 mb-4">
                  {product?.inStock ? "В наличии" : "Нет в наличии"}
                </p>
                <Button className="w-full mb-2 bg-yellow-400 hover:bg-yellow-500 text-black text-md" onClick={() => handleBuyItemNow(product)}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Купить
                </Button>
                <Button className="w-full text-md" variant="outline" onClick={() => handleAddItemToCart(product)}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  В корзину
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* About This Item */}
          <section aria-label="Product features">
            <h2 className="text-xl font-semibold mb-4">Описание товара:</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {product?.description.map((desc: string) => (
                <li key={desc}>{desc}</li>
              ))}
            </ul>
            <div>
          </div>

          </section>
        </div>
      </div>
    </main>
  );
}
