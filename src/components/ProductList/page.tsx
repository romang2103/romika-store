"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "../ui/spinner";
import { HeartIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { ProductData } from "@/interfaces/interfaces";
import { useFilterStore } from "@/store/useFilterStore";
import { useProductStore } from "@/store/useProductStore";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductList() {
  const {
    products,
    loading,
    filteredProducts,
    searchTerm,
    setProducts,
    setFilteredProducts,
    setLoading,
    filterProducts,
  } = useProductStore();
  const { addItemToCart, openCartModal } = useCartStore();
  const { Filters } = useFilterStore();

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(5);
  const [totalProducts, setTotalProducts] = useState<number>(48);
  const [productsPerPage] = useState<number>(8);
  const [productsOnPage, setProductsOnPage] = useState<ProductData[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function loadProducts() {
      try {
        console.log("Trying to load products");
        setFilteredProducts(products);
        setTotalProducts(products.length);
        setTotalPages(Math.ceil(products.length / productsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    loadProducts();
  }, [productsPerPage]);

  useEffect(() => {
    async function loadFilteredProducts() {
      try {
        console.log("Trying to load filtered products");
        await filterProducts(Filters);
        handlePageChange(1);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    }

    loadFilteredProducts();
  }, [Filters, searchTerm]);

  useEffect(() => {
    setTotalProducts(filteredProducts.length);
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
  }, [filteredProducts, productsPerPage]);

  useEffect(() => {
    const currentPage = Number(searchParams.get("page")) || 1;
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    const entries = filteredProducts.slice(start, end);
    setProductsOnPage(entries);
    setPage(currentPage);
  }, [searchParams, filteredProducts, productsPerPage]);

  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };

  const handleAddItemToCart = async (product: ProductData) => {
    await addItemToCart(product);
    openCartModal();
  };

  const handleOpenProductPage = async (product: ProductData) => {
    // router.push(`/pages/product-page?id=${product.product_id}`);
    router.push(`/?id=${product.product_id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsOnPage.map((product) => (
          <Card
            key={product.product_id}
            className="group hover:shadow-xl transition-shadow duration-300 border border-gray-200"
          >
            <CardContent className="p-0">
              {/* Image Container with Hover Effect */}
              <div 
                className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                onClick={() => handleOpenProductPage(product)}
              >
                <img
                  src={product.image_urls[0]}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold px-4 py-2 bg-primary rounded-md">
                      Нет в наличии
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                {/* Product Name */}
                <h3 
                  className="font-medium line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleOpenProductPage(product)}
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-800">
                    {product.price} руб
                  </span>
                  {product.inStock && (
                    <span className="text-sm text-primary-600 font-medium">
                      В наличии
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary-700"
                    onClick={() => handleAddItemToCart(product)}
                    disabled={!product.inStock}
                  >
                    В корзину
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <HeartIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 mb-12">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className="hover:bg-primary-50" />
            </PaginationItem>
            {totalPages > 5 && page - 1 > 3 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={page === 1}
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationEllipsis />
              </>
            )}
            {[...Array(totalPages)]
              .map((_, index) => index + 1)
              .filter(
                (pageNumber) =>
                  pageNumber >= page - 2 && pageNumber <= page + 2,
              )
              .map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}
            {totalPages > 5 && page + 2 < totalPages && (
              <>
                <PaginationEllipsis />
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={page === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext className="hover:bg-primary-50" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
