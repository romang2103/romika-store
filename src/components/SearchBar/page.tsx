"use client";

import { Input } from "@/components/ui/input";
import { useFilterStore } from "@/store/useFilterStore";
import { useProductStore } from "@/store/useProductStore";

export default function SearchBar() {
  const { setSearchTerm, filterProducts } = useProductStore();
  const { Filters } = useFilterStore();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    filterProducts(Filters); // Call your filtering logic here
  };

  return (
    <div className="relative mb-4 border">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <Input
          type="search"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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
