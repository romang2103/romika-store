/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TZu6KpKO4W2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useSearchParams } from "next/navigation";
import ProductList from "@/components/ProductList/page";
import ProductPage from "../product-page/page";
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
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <style jsx>{`
          .spinner-container {
            border: 1px solid black #f3f3f3;
            display: flex;
            justify-content: center;
            // align-items: center;
            height: calc(100vh - 60px);
            width: 100vw;
            margin-top: 60px; 
          }
          .spinner {
            border: 12px solid #f3f3f3;
            border-top: 12px solid #3498db;
            border-radius: 50%;
            width: 80px;
            height: 80px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
        </style>
      </div>
    );
  }

  return (
    <div>
      {productId ? <ProductPage /> : <ProductList />}
    </div>
  );
}
