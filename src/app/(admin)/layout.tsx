"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, role, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, role, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          <a
            href="/admin/dashboard"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a
            href="/admin/products"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Products
          </a>
          <a
            href="/admin/orders"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Orders
          </a>
          <a
            href="/admin/users"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Users
          </a>
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