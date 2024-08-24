import { create } from "zustand";
import { ProductData } from "@/interfaces/interfaces";
import { getAllProducts } from "@/use-cases/productUseCases";
import ProductList from "@/components/ProductList/page";

interface ProductStore {
  products: ProductData[];
  filteredProducts: ProductData[];
  loading: boolean;
  searchTerm: string;
  setProducts: (productList: ProductData[]) => void;
  setFilteredProducts: (productList: ProductData[]) => void;
  setLoading: (state: boolean) => void;
  setSearchTerm: (term: string) => void;
  filterProducts: (filters: number[]) => Promise<void>;
  searchProducts: () => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  filteredProducts: [],
  loading: true,
  searchTerm: "",
  setProducts: (productList) => set({ products: productList }),
  setFilteredProducts: (productList) => set({ filteredProducts: productList }),
  setLoading: (state) => set({ loading: state }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  fetchProducts: async (): Promise<void> => {
    set({ loading: true });
    try {
      const products = await getAllProducts();
      set({ products: products, filteredProducts: products, loading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ loading: false });
      throw error;
    }
  },
  searchProducts: async () => {
    const { products, searchTerm } = get();
    const filteredProducts = products.filter((product: ProductData) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    set({ filteredProducts });
  },
  filterProducts: async (filters) => {
    // Implement your filtering logic here if needed
    if (filters.length > 0) {
      const stringFilters = filters.map((filter) => filter.toString());
      const filteredProductList = get().products.filter(
        (product: ProductData) =>
          product.categories.some((category) =>
            stringFilters.includes(category),
          ),
      );
      get().setFilteredProducts(filteredProductList);
    } else {
      get().setFilteredProducts(get().products);
    }
    console.log("filters and products: ", filters, get().products.length);
  },
}));
