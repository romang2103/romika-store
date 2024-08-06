import { create } from 'zustand';
import { CartItemData, ProductData } from '@/interfaces/interfaces';
import { ObjectId } from 'mongodb';

interface FilterState {
    Filters: ObjectId[];
    isFilterModalOpen: boolean;
    openFilterModal: () => void;
    closeFilterModal: () => void;
    addFilter: (filter: ObjectId) => void;
    removeFilter: (filter: ObjectId) => void;
    clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    Filters: [],
    isFilterModalOpen: false,
    openFilterModal: () => set(() => ({ isFilterModalOpen: true })),
    closeFilterModal: () => set(() => ({ isFilterModalOpen: false })),
    clearFilters: () => set(() => ({ Filters: [] })),
    addFilter: (filter: ObjectId) => set((state) => ({ Filters: [...state.Filters, filter] })),
    removeFilter: (filter: ObjectId) => set((state) => ({ Filters: state.Filters.filter((f) => f !== filter) })),
}));
