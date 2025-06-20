"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartIcon } from "lucide-react";
import { LoadingSpinner } from "../ui/spinner";
import { ProductData } from "@/interfaces/interfaces";
import { useCartStore } from "@/store/useCartStore";
import { useFilterStore } from "@/store/useFilterStore";
import { useProductStore } from "@/store/useProductStore";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * Handles paginated filtering logic that depends on search params
 */
function ProductPaginationController() {
  const {
    products,
    loading,
    filteredProducts,
    searchTerm,
    setFilteredProducts,
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
    setFilteredProducts(products);
    setTotalProducts(products.length);
    setTotalPages(Math.ceil(products.length / productsPerPage));
  }, [products, productsPerPage, setFilteredProducts]);

  useEffect(() => {
    filterProducts(Filters);
  }, [Filters, searchTerm, filterProducts]);

  useEffect(() => {
    const currentPage = Number(searchParams.get("page")) || 1;
    const maxPage = Math.ceil(filteredProducts.length / productsPerPage) || 1;

    if (currentPage > maxPage) {
      router.push(`/?page=1`);
      return;
    }

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    setProductsOnPage(filteredProducts.slice(start, end));
    setPage(currentPage);
    setTotalPages(maxPage);
    setTotalProducts(filteredProducts.length);
  }, [filteredProducts, searchParams, productsPerPage, router]);

  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };

  const handleAddItemToCart = async (product: ProductData) => {
    await addItemToCart(product);
    openCartModal();
  };

  const handleOpenProductPage = (product: ProductData) => {
    router.push(`/?id=${product.product_id}&page=${page}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsOnPage.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            <p className="text-xl">Нет товаров по вашему запросу.</p>
            <p className="text-sm">Попробуйте изменить фильтры или поиск.</p>
          </div>
        ) : (
          productsOnPage.map((product) => (
            <Card
              key={product.product_id}
              className="group hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <CardContent className="p-0">
                <div
                  className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                  onClick={() => handleOpenProductPage(product)}
                >
                  <Image
                    src={product.image_urls[0]}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
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
                  <h3
                    className="font-medium line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleOpenProductPage(product)}
                  >
                    {product.name}
                  </h3>

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
          ))
        )}
      </div>

      {productsOnPage.length > 0 && (
        <div className="mt-8 mb-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className="hover:bg-primary-50"
                  onClick={() => handlePageChange(Math.max(page - 1, 1))}
                />
              </PaginationItem>

              {totalPages > 5 && page - 1 > 3 && (
                <>
                  <PaginationItem>
                    <PaginationLink
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
                .filter((pageNumber) => pageNumber >= page - 2 && pageNumber <= page + 2)
                .map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
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
                      isActive={page === totalPages}
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  className="hover:bg-primary-50"
                  onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

/**
 * Top-level export wrapped in Suspense to safely support useSearchParams()
 */
export default function ProductList() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductPaginationController />
    </Suspense>
  );
}
