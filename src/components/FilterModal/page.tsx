import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface FilterModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onOpenChange }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="sm:max-w-sm">
        <div className="bg-white border-r p-4 md:p-8">
          <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
          <div className="space-y-3">
            {[
              { id: "category-4", label: "Vases" },
              { id: "category-5", label: "Bijouterie" },
              { id: "category-6", label: "Souvenirs" },
              { id: "category-7", label: "Dishes" },
              { id: "category-8", label: "Screens, hammocks, mosquito nets" },
              { id: "category-9", label: "Umbrellas" },
              { id: "category-10", label: "Caskets, chests" },
              { id: "category-11", label: "Household goods" },
              { id: "category-12", label: "Furniture" },
              { id: "category-13", label: 'Printed painting "New product"' },
              { id: "category-14", label: "Pens" },
              { id: "category-15", label: "Everything for flowers" },
            ].map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox id={category.id} />
                <Label htmlFor={category.id}>{category.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterModal;
