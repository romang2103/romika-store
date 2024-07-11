import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

export function FilterSideBar() {
    return (
        <div className="hidden md:block bg-white border-r p-4 md:p-8">
          <h3 className="text-md font-semibold mb-4">Filter by Category</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="category-4" />
              <Label htmlFor="category-4">Vases</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-5" />
              <Label htmlFor="category-5">Bijouterie</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-6" />
              <Label htmlFor="category-6">Souvenirs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-7" />
              <Label htmlFor="category-7">Dishes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-8" />
              <Label htmlFor="category-8">
                Screens, hammocks, mosquito nets
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-9" />
              <Label htmlFor="category-9">Umbrellas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-10" />
              <Label htmlFor="category-10">Caskets, chests</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-11" />
              <Label htmlFor="category-11">Household goods</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-12" />
              <Label htmlFor="category-12">Furniture</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-13" />
              <Label htmlFor="category-13">
                Printed painting "New product"
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-14" />
              <Label htmlFor="category-14">Pens</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="category-15" />
              <Label htmlFor="category-15">Everything for flowers</Label>
            </div>
          </div>
        </div>
    )
}