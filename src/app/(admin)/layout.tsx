"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            View Store
          </Link>
          <Link
            href="/products"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Orders
          </Link>
          <Link
            href="/admin/users"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Users
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
} 