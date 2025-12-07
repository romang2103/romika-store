import { create } from "zustand";
import { CategoryData } from "@/interfaces/interfaces";
import { getCategories } from "@/data-access/categoryRepository";

interface CategoryState {
  categories: CategoryData[]; // Available categories
  loading: boolean; // Loading state for fetching categories
  error: string | null; // Error state for fetching categories
  fetchCategories: () => Promise<void>; // Method to fetch categories
  getCategoryName: (categoryId: number) => string | undefined; // Helper to get category name by id
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [], // Initially no categories loaded
  loading: false, // Loading starts as false
  error: null, // No error initially

  // Method to load categories asynchronously
  fetchCategories: async () => {
    set({ loading: true, error: null }); // Set loading state
    try {
      const categories = await getCategories();
      console.log("Fetched categories:", categories);
      set({ categories: categories, loading: false });
      console.log("Categories in store after fetch:", get().categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ error: "Failed to load categories", loading: false });
    }
  },

  // Helper method to get category name by id
  getCategoryName: (categoryId: number) => {
    const category = get().categories.find((cat) => cat.id === categoryId);
    return category?.name;
  },
}));
