"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductList from "@/components/ProductList/page";
import ProductPage from "../product-page/page";
import { useProductStore } from "@/store/useProductStore";
import { useFilterStore } from "@/store/useFilterStore";
import { getOrCreateSessionUseCase } from "@/use-cases/sessionUseCases";
import { getCart } from "@/data-access/cartRepository";
import { useCartStore } from "@/store/useCartStore";

// This component decides what to render based on the search params (e.g., ?id=123)
function ProductViewSelector() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  return productId ? <ProductPage /> : <ProductList />;
}

export default function MainPage() {
  const { loadFilterOptions } = useFilterStore();
  const { fetchProducts, loading } = useProductStore();
  const { loadCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
    loadFilterOptions();
    const getSession = async () => {
      await getOrCreateSessionUseCase();
      await loadCart();
    }
    getSession();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <style jsx>{`
          .spinner-container {
            display: flex;
            justify-content: center;
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
        `}</style>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading product view...</div>}>
      <ProductViewSelector />
    </Suspense>
  );
}
