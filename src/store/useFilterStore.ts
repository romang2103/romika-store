import { create } from "zustand";
import { FilterOptionData } from "@/interfaces/interfaces";
import { getFilterOptions } from "@/data-access/filterRepository";

interface FilterState {
  Filters: number[]; // Current selected filters
  filterOptions: FilterOptionData[]; // Available filter options
  isFilterModalOpen: boolean; // Modal state
  loading: boolean; // Loading state for fetching filter options
  error: string | null; // Error state for fetching filter options
  openFilterModal: () => void;
  closeFilterModal: () => void;
  addFilter: (filter: number) => void;
  removeFilter: (filter: number) => void;
  clearFilters: () => void;
  loadFilterOptions: () => Promise<void>; // Method to fetch filter options
}

export const useFilterStore = create<FilterState>((set) => ({
  Filters: [], // Initially no filters selected
  filterOptions: [], // Initially no filter options loaded
  isFilterModalOpen: false,
  loading: false, // Loading starts as false
  error: null, // No error initially

  // Modal control methods
  openFilterModal: () => set({ isFilterModalOpen: true }),
  closeFilterModal: () => set({ isFilterModalOpen: false }),

  // Filter management methods
  clearFilters: () => set({ Filters: [] }),
  addFilter: (filter: number) =>
    set((state) => ({ Filters: [...state.Filters, filter] })),
  removeFilter: (filter: number) =>
    set((state) => ({ Filters: state.Filters.filter((f) => f !== filter) })),

  // Method to load filter options asynchronously
  loadFilterOptions: async () => {
    set({ loading: true, error: null }); // Set loading state
    try {
      const filterOptions = await getFilterOptions();
      set({ filterOptions: filterOptions, loading: false });
    } catch (error) {
      console.error("Error fetching filter options:", error);
      set({ error: "Failed to load filter options", loading: false });
    }
  },
}));
