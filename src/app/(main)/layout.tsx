"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Header from "@/components/Header/page";
import SearchBar from "@/components/SearchBar/page";
import FilterModal from "@/components/FilterModal/page";
import CartModal from "@/components/CartModal/page";
import { useFilterStore } from "@/store/useFilterStore";
import { useCartStore } from "@/store/useCartStore";
import { Toaster } from "@/components/ui/sonner";

const NO_HEADER_ROUTES = ["/checkout", "/login", "/signup", "/admin"];

/**
 * LayoutController handles layout visibility logic based on route and searchParams
 */
function LayoutController({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isFilterModalOpen, openFilterModal, closeFilterModal } = useFilterStore();
  const { isCartModalOpen, openCartModal, closeCartModal } = useCartStore();

  const shouldShowHeader = !NO_HEADER_ROUTES.includes(pathname);
  const shouldShowSearchBar = searchParams.has("page") && !searchParams.has("id");

  return (
    <div className="min-h-screen bg-gray-100">
      {shouldShowHeader && <Header />}
      <main className="p-4 md:px-8">
        {shouldShowSearchBar && <SearchBar />}
        {children}
      </main>

      <Toaster />
      <FilterModal isOpen={isFilterModalOpen} onOpenChange={openFilterModal} />
      <CartModal isOpen={isCartModalOpen} onOpenChange={openCartModal} />
    </div>
  );
}

/**
 * RootLayout wraps the dynamic LayoutController in Suspense for searchParams support
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LayoutController>{children}</LayoutController>
    </Suspense>
  );
}
