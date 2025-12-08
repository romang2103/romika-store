import { CategoryData } from "@/interfaces/interfaces";
import {
    getCategories,
    createCategory,
    deleteCategory,
    getCategoryById
} from "@/data-access/categoryRepository";

export async function getCategoriesUseCase(): Promise<CategoryData[]> {
    const categories = await getCategories();
    return categories;
}

export async function createCategoryUseCase(categoryData: Omit<CategoryData, '_id'>): Promise<CategoryData> {
    try {
        const newCategory = await createCategory(categoryData);
        return newCategory;
    } catch (error) {
        console.error('Error creating category:', error);
        throw new Error('Failed to create category');
    }
}

export async function deleteCategoryUseCase(categoryId: number): Promise<void> {
    try {
        await deleteCategory(categoryId);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw new Error('Failed to delete category');
    }
}

export async function getCategoryByIdUseCase(categoryId: number): Promise<CategoryData | null> {
    try {
        const category = await getCategoryById(categoryId);
        return category;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw new Error('Failed to fetch category');
    }
}
