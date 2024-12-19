"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    return <div>Loading... 2</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
      {productsOnPage.map((product) => (
        <Card
          key={product.product_id}
          className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 flex flex-col"
        >
          <CardContent className="flex flex-col flex-1 p-4">
            {/* Image Container */}
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 mb-4 rounded-md cursor-pointer">
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
                onClick={() => handleOpenProductPage(product)}
              />
            </div>

            {/* Product Name */}
            <h3
              className="text-lg font-semibold cursor-pointer sm:h-20 md:h-14 lg:h-22 line-clamp-2 hover:underline"
              onClick={() => handleOpenProductPage(product)}
            >
              {product.name}
            </h3>

            {/* Product Price */}
            <p className="mt-2 text-xl font-bold">{product.price} rub</p>

            {/* Spacer to push the final row to the bottom */}
            <div className="mt-4 flex-grow"></div>

            {/* Final Row with Responsive Layout */}
            <div className="flex flex-row justify-between lg:flex-col items-center lg:items-end justify-end gap-2 mt-4 w-full">
              {/* Buttons Container */}
              <div className="flex items-center space-x-2 order-2 lg:order-1">
                <Button size="sm" onClick={() => handleAddItemToCart(product)}>
                  В корзину
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => { /* Implement like functionality here */ }}
                >
                  <HeartIcon className="w-5 h-5" />
                  <span className="sr-only">Like</span>
                </Button>
              </div>

              {/* In Stock Span */}
              <span
                className={`inline-block px-2 py-1 rounded-md text-sm font-medium order-1 lg:order-2 ${
                  product.inStock
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                } mt-2 lg:mt-0 w-auto lg:text-right`}
              >
                {product.inStock ? "В наличии" : "Нет в наличии"}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="col-span-full flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(Math.max(page - 1, 1))}
              />
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
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
