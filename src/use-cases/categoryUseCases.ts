import { CategoryData } from "@/interfaces/interfaces";
import { getCategories } from "@/data-access/categoryRepository";

export async function getCategoriesUseCase(): Promise<CategoryData[]> {
    const categories = await getCategories();
    return categories;
}
