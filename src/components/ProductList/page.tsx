"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { getProductList } from "./action";
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
import { getAllProducts } from "@/use-cases/productUseCases";

export default function ProductList() {
  const {
    products,
    loading,
    filteredProducts,
    searchTerm,
    setProducts,
    setFilteredProducts,
    setLoading,
    setSearchTerm,
    fetchProducts,
    filterProducts,
    searchProducts,
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
        console.log("trying to load products");
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
        setTotalProducts(data.length);
        setTotalPages(Math.ceil(data.length / productsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadFilteredProducts() {
      try {
        setLoading(true);
        console.log("trying to load filtered products");
        await filterProducts(Filters);
      } catch (error) {
        console.error("Error fetching filtered products: ", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadFilteredProducts();
  }, [Filters]);

  useEffect(() => {
    setTotalProducts(filteredProducts.length);
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
  }, [filteredProducts]);

  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;

    const entries = filteredProducts.slice(start, end);
    setProductsOnPage(entries);
    setPage(page);
  }, [searchParams, filteredProducts]);

  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };

  const handleAddItemToCart = async (product: ProductData) => {
    await addItemToCart(product);
    openCartModal();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {productsOnPage.map((product) => (
        <Card
          key={product.product_id}
          className="bg-white rounded-lg shadow-md"
        >
          <CardContent className="p-4">
            <img
              src={product.image_urls[0]}
              alt={product.name}
              className="w-full h-64 md:h-80 lg:h-96 object-cover mb-4 rounded-md"
            />
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="mt-2 text-xl font-bold">{product.price} rub</p>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
                    product.inStock
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-500 hover:text-red-500"
                >
                  <HeartIcon className="w-5 h-5" />
                  <span className="sr-only">Like</span>
                </Button>
                <Button size="sm" onClick={() => handleAddItemToCart(product)}>
                  Add to Cart
                </Button>
              </div>
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