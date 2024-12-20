import { create } from "zustand";
import { ProductData } from "@/interfaces/interfaces";
import { getAllProducts } from "@/use-cases/productUseCases";

interface ProductStore {
  products: ProductData[];
  filteredProducts: ProductData[];
  searchedProducts: ProductData[];
  loading: boolean;
  searchTerm: string;
  setProducts: (productList: ProductData[]) => void;
  setFilteredProducts: (productList: ProductData[]) => void;
  // setSearchedProducts: (productList: ProductData[]) => void;
  setLoading: (state: boolean) => void;
  setSearchTerm: (term: string) => void;
  filterProducts: (filters: number[]) => Promise<void>;
  // searchProducts: () => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  filteredProducts: [],
  searchedProducts: [],
  loading: true,
  searchTerm: "",
  setProducts: (productList) => set({ products: productList }),
  setFilteredProducts: (productList) => set({ filteredProducts: productList }),
  // setSearchedProducts: (productList) => set({ searchedProducts: productList }),
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
  // searchProducts: async () => {
  //   const searchedProducts = get().filteredProducts.filter((product: ProductData) =>
  //     product.name.toLowerCase().includes(get().searchTerm.toLowerCase()),
  //   );
  //   get().setSearchedProducts(searchedProducts);
  // },
  filterProducts: async (filters) => {
    set({ loading: true });
    const allProducts = get().products;
    const searchTerm = get().searchTerm.toLowerCase();
    let filteredProductList = allProducts;
  
    // Apply category filtering if filters are provided
    if (filters.length > 0) {
      const stringFilters = filters.map((filter) => filter.toString());  // Convert filters to string
      filteredProductList = filteredProductList.filter((product: ProductData) =>
        product.categories.some((category) => stringFilters.includes(category)),
      );
    }
  
    // Apply search term filtering if search term is not empty
    if (searchTerm !== "") {
      filteredProductList = filteredProductList.filter((product: ProductData) =>
        product.name.toLowerCase().includes(searchTerm),
      );
    }
  
    // Set filtered products to the computed list (could be filtered by categories, search term, both, or neither)
    get().setFilteredProducts(filteredProductList);
    set({ loading: false });

    console.log("filters and products: ", filters, allProducts.length);
  },
}));
