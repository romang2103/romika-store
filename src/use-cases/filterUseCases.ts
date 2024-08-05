import { FilterOptionData } from "@/interfaces/interfaces";
import { getFilterOptions } from "@/data-access/filterRepository";

export async function getFilterOptionsUseCase(): Promise<FilterOptionData[]> {
    const filterOptions = await getFilterOptions();
    return filterOptions;
}
