/**
 * v0 by Vercel.
 * @see https://v0.dev/t/TZu6KpKO4W2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ProductList from "@/components/ProductList/page";

export default function Component() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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
          <ShoppingCartIcon className="w-6 h-6" />
        </div>
      </header>
      <div className="flex">
        {/* <div className="hidden md:block bg-white border-r p-4 md:p-8">
          <h3 className="text-md font-semibold mb-4">Filter by Category</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="category-4" />
              <Label htmlFor="category-4">Vases</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-5" />
              <Label htmlFor="category-5">Bijouterie</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-6" />
              <Label htmlFor="category-6">Souvenirs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-7" />
              <Label htmlFor="category-7">Dishes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-8" />
              <Label htmlFor="category-8">
                Screens, hammocks, mosquito nets
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-9" />
              <Label htmlFor="category-9">Umbrellas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-10" />
              <Label htmlFor="category-10">Caskets, chests</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-11" />
              <Label htmlFor="category-11">Household goods</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-12" />
              <Label htmlFor="category-12">Furniture</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-13" />
              <Label htmlFor="category-13">
                Printed painting "New product"
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-14" />
              <Label htmlFor="category-14">Pens</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-15" />
              <Label htmlFor="category-15">Everything for flowers</Label>
            </div>
          </div>
        </div> */}
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
      <Sheet open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <SheetContent side="left" className="sm:max-w-sm">
          <div className=" bg-white border-r p-4 md:p-8">
            <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="category-4" />
                <Label htmlFor="category-4">Vases</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-5" />
                <Label htmlFor="category-5">Bijouterie</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-6" />
                <Label htmlFor="category-6">Souvenirs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-7" />
                <Label htmlFor="category-7">Dishes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-8" />
                <Label htmlFor="category-8">
                  Screens, hammocks, mosquito nets
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-9" />
                <Label htmlFor="category-9">Umbrellas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-10" />
                <Label htmlFor="category-10">Caskets, chests</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-11" />
                <Label htmlFor="category-11">Household goods</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-12" />
                <Label htmlFor="category-12">Furniture</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-13" />
                <Label htmlFor="category-13">
                  Printed painting "New product"
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-14" />
                <Label htmlFor="category-14">Pens</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="category-15" />
                <Label htmlFor="category-15">Everything for flowers</Label>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function HeartIcon(props) {
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

function MenuIcon(props) {
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

function SearchIcon(props) {
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

function ShoppingCartIcon(props) {
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

function UserIcon(props) {
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
