import { create } from "zustand";
import { CartItemData, ProductData } from "@/interfaces/interfaces";

interface FilterState {
  Filters: number[];
  isFilterModalOpen: boolean;
  openFilterModal: () => void;
  closeFilterModal: () => void;
  addFilter: (filter: number) => void;
  removeFilter: (filter: number) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  Filters: [],
  isFilterModalOpen: false,
  openFilterModal: () => set(() => ({ isFilterModalOpen: true })),
  closeFilterModal: () => set(() => ({ isFilterModalOpen: false })),
  clearFilters: () => set(() => ({ Filters: [] })),
  addFilter: (filter: number) =>
    set((state) => ({ Filters: [...state.Filters, filter] })),
  removeFilter: (filter: number) =>
    set((state) => ({ Filters: state.Filters.filter((f) => f !== filter) })),
}));
