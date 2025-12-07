import { useCartStore } from "@/store/useCartStore";
import { useFilterStore } from "@/store/useFilterStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { JSX, SVGProps } from "react";


export default function Header() {
  const router = useRouter();
  const { openFilterModal, clearFilters } = useFilterStore();
  const { openCartModal, CartItems } = useCartStore();
  const { isAuthenticated, role, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button 
              onClick={openFilterModal}
              className="p-2 hover:bg-primary-700 rounded-full transition-colors"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={() => {
                clearFilters()
                router.push('/')
              }}
              className="text-xl font-bold hover:opacity-80 transition-opacity"
            >
              Romika
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <div className="flex items-center space-x-2 mr-2">
                <span className="text-sm font-medium">
                  {role === 'admin' ? 'Admin' : 'User'}
                </span>
                {role === 'admin' && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-sm px-3 py-1 bg-white text-primary rounded hover:bg-gray-100 transition-colors"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1 bg-white text-primary rounded hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
            <button className="p-2 hover:bg-primary-700 rounded-full transition-colors">
              <UserIcon className="w-6 h-6" />
            </button>
            <button
              onClick={openCartModal}
              className="p-2 hover:bg-primary-700 rounded-full transition-colors relative"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {CartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {CartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
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
