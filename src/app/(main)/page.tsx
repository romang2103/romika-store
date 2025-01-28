/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TZu6KpKO4W2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useSearchParams } from "next/navigation";
import ProductList from "@/components/ProductList/page";
import ProductPage from "../pages/product-page/page";
import { useProductStore } from "@/store/useProductStore";
import { useFilterStore } from "@/store/useFilterStore";
import { useEffect } from "react";

export default function MainPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  
  const { loadFilterOptions } = useFilterStore();
  const { fetchProducts, loading } = useProductStore();

  useEffect(() => {
    fetchProducts(); // Fetch product data when the page loads
    loadFilterOptions(); // Fetch filter options when the page loads
  }, [fetchProducts]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      {productId ? <ProductPage /> : <ProductList />}
    </div>
  );
}

