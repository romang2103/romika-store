"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Header from "@/components/Header/page";
import SearchBar from "@/components/SearchBar/page";
import FilterModal from "@/components/FilterModal/page";
import CartModal from "@/components/CartModal/page";
import { useFilterStore } from "@/store/useFilterStore";
import { useCartStore } from "@/store/useCartStore";
import { Toaster } from "@/components/ui/sonner";
const NO_HEADER_ROUTES = ["/checkout", "/login", "/signup", "/admin"];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isFilterModalOpen, openFilterModal, closeFilterModal } = useFilterStore();
  const { isCartModalOpen, openCartModal, closeCartModal } = useCartStore();

  const shouldShowHeader = !NO_HEADER_ROUTES.includes(pathname);
  const shouldShowSearchBar = !searchParams.has("id");

  // return (
  //   <div className="min-h-screen bg-gray-100">
  //       {shouldShowHeader && <Header />}
  //       <main className="p-4 md:px-8">
  //           {shouldShowSearchBar && <SearchBar />}
  //           {children}
  //       </main>

  //     {/* Modals */}
  //     <FilterModal isOpen={isFilterModalOpen} onOpenChange={openFilterModal} />
  //     <CartModal isOpen={isCartModalOpen} onOpenChange={openCartModal} />
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gray-100">
        {shouldShowHeader && <Header />}
        <main className="p-4 md:px-8">
            {shouldShowSearchBar && <SearchBar />}
            {children}
        </main>

      {/* Modals */}
      <Toaster />
      <FilterModal isOpen={isFilterModalOpen} onOpenChange={openFilterModal} />
      <CartModal isOpen={isCartModalOpen} onOpenChange={openCartModal} />
    </div>
  );
}
