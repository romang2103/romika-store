import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useFilterStore } from "@/store/useFilterStore";
import { getFilterOptionsUseCase } from "@/use-cases/filterUseCases";
import { useEffect, useState } from "react";
import { FilterOptionData } from "@/interfaces/interfaces";
import { ObjectId } from "mongodb";

interface FilterModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen }) => {
  const { closeFilterModal, removeFilter, addFilter, Filters } = useFilterStore();
  const [filterOptions, setFilterOptions] = useState<FilterOptionData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getFilterOptionsUseCase();
      setFilterOptions(categories);
    };
  
    fetchData();
  }, []);

  const handleCheckboxChange = (categoryId: ObjectId) => {
    if (Filters.includes(categoryId)) {
      // If already selected, remove the filter
      removeFilter(categoryId);
    } else {
      // If not selected, add the filter
      addFilter(categoryId);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeFilterModal}>
      <SheetContent side="left" className="sm:max-w-sm">
        <div className="bg-white border-r p-4 md:p-8">
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          <div className="space-y-3">
            {filterOptions.map((category) => (
              <div key={category.name} className="flex items-center space-x-2">
                <Checkbox id={category.name} checked={Filters.includes(category._id)} onCheckedChange={() => handleCheckboxChange(category._id)} />
                <Label htmlFor={category.name}>{category.name}</Label>
              </div>
              ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterModal;
