/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TZu6KpKO4W2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { JSX, SVGProps, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import ProductList from "@/components/ProductList/page";
import FilterModal from "@/components/FilterModal/page";
import { FilterSideBar } from "@/components/FilterSideBar/page";
import { createSessionUseCase, getSessionUseCase } from "@/use-cases/sessionUseCases";
import CartModal from "@/components/CartModal/page";
import { SessionData } from "@/interfaces/interfaces";
import { useCartStore } from "@/store/useCartStore";
// import { HeartIcon, MenuIcon, SearchIcon, ShoppingCartIcon, UserIcon } from "lucide-react";

export default function Component() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  // const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { isCartModalOpen, openCartModal } = useCartStore();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        let currentSession = await getSessionUseCase();
        console.log("currentSession: ", currentSession);
        if (!currentSession) {
          console.log("Creating session...");
          currentSession = await createSessionUseCase();
        }
        console.log("currentSession: ", currentSession);
        setSession(currentSession as SessionData);
      } catch (error) {
        console.error("Error initializing session:", error);
      }
    };

    initializeSession();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-primary shadow-md md:px-8">
        <div className="flex items-center space-x-4">
          <button
            // className="md:hidden"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold text-secondary">Romika</span>
        </div>
        <div className="flex items-center space-x-4">
          <UserIcon className="w-6 h-6" />
          <button onClick={() => openCartModal()}>
            <ShoppingCartIcon className="w-6 h-6" />
          </button>
        </div>
      </header>
      <div className="flex">
        <FilterSideBar />
        <main className="flex-1 p-4 md:px-8">
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <ProductList />
        </main>
      </div>
      <FilterModal isOpen={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}/>
      <CartModal isOpen={isCartModalOpen} onOpenChange={openCartModal}/>
    </div>
  );
}

function HeartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      color="white"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ShoppingCartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      color="white"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      color="white"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
