import { create } from 'zustand';
import { CartItemData, ProductData } from '@/interfaces/interfaces';

interface FilterState {
    Filters: string[];
    isFilterModalOpen: boolean;
    openFilterModal: () => void;
    closeFilterModal: () => void;
    addFilter: (filter: string) => void;
    clearFilter: () => void;
    // loadFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    Filters: [],
    isFilterModalOpen: false,
    openFilterModal: () => set(() => ({ isFilterModalOpen: true })),
    closeFilterModal: () => set(() => ({ isFilterModalOpen: false })),
    addFilter: (filter: string) => set((state) => ({ Filters: [...state.Filters, filter] })),
    clearFilter: () => set(() => ({ Filters: [] })),
    // loadFilters: async () => {
    //     set({ Filters: filters });
    // }
}));
