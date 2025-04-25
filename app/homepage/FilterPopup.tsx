import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Clock, Users, Sparkle } from "lucide-react";
import { useFilter } from "@/contexts/FilterContext";
import { Input } from "@/components/ui/input";

interface SearchPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
export default function SearchPopup({ open, setOpen }: SearchPopupProps) {
  const {
    priceRange, setPriceRange,
    gender, setGender,
    age, setAge,
    time, setTime,
    setAreFiltersApplied,
    triggerFilterUpdate
  } = useFilter();

  const times = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const clearFilter: () => void = () => {
    setGender("");
    setPriceRange([0, 10000]);
    setTime("");
    setAge('');
    setAreFiltersApplied(false);
  };

  const handleSearch = () => {
    setAreFiltersApplied(true);
    triggerFilterUpdate();
    setOpen(false);
  };

  // Function to handle manual input changes for min price
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.max(0, Math.min(parseInt(e.target.value) || 0, priceRange[1]));
    setPriceRange([newMin, priceRange[1]]);
  };

  // Function to handle manual input changes for max price
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.min(10000, Math.max(parseInt(e.target.value) || 0, priceRange[0]));
    setPriceRange([priceRange[0], newMax]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg md:max-w-xl p-0 rounded-2xl shadow-lg bg-white overflow-hidden border border-gray-100 [&>button]:hidden">
        <div className="px-6 pt-5 pb-2">
          <DialogHeader className="flex-row justify-between items-center mb-2">
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Filter size={20} className="text-[#013161]" />
              <span>Search</span>
            </DialogTitle>
            <DialogClose className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all">
              <span aria-hidden="true">&times;</span>
            </DialogClose>
          </DialogHeader>
          <p className="text-gray-500 text-sm">Find the perfect hobby for you</p>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Age Input */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Users size={16} className="text-[#013161]" />
              <span>What&apos;s Your Age?</span>
            </Label>
            <Select value={age} onValueChange={setAge}>
              <SelectTrigger className="w-full border-gray-200 hover:border-blue-200 rounded-xl focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all">
                <SelectValue placeholder="Search By Age" />
              </SelectTrigger>
              <SelectContent className="max-h-72 rounded-xl">
                {Array.from({ length: 69 }, (_, i) => i + 1).map((age) => (
                  <SelectItem key={age} value={age.toString()}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Selection */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Users size={16} className="text-[#013161]" />
              <span>Select Gender</span>
            </Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
              <div className="flex-1">
                <Label className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl p-3 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 w-full h-full data-[state=checked]:bg-blue-50 data-[state=checked]:border-[#1E3A8A]">
                  <RadioGroupItem value="male" id="male" className="text-[#013161]" />
                  <span>Male</span>
                </Label>
              </div>
              <div className="flex-1">
                <Label className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl p-3 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 w-full h-full data-[state=checked]:bg-blue-50 data-[state=checked]:border-[#1E3A8A]">
                  <RadioGroupItem value="female" id="female" className="text-[#013161]" />
                  <span>Female</span>
                </Label>
              </div>
              <div className="flex-1">
                <Label className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl p-3 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-200 w-full h-full data-[state=checked]:bg-blue-50 data-[state=checked]:border-[#1E3A8A]">
                  <RadioGroupItem value="trans" id="trans" className="text-[#013161]" />
                  <span>Trans</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Time Input */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock size={16} className="text-[#013161]" />
              <span>Select Time</span>
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="w-full border-gray-200 hover:border-blue-200 rounded-xl focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] transition-all">
                <SelectValue placeholder="Search By Time" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {times.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sparkle size={16} className="text-[#013161]" />
              <span>Price Range</span>
            </Label>
            <div className="px-2 pt-2">
              <div className="text-sm text-gray-500 mb-3 flex justify-between">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
              <Slider
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
                className="[&>span]:bg-[#1E3A8A]"
              />

              {/* Manual Price Input Fields */}
              <div className="flex gap-4 mt-3">
                <div className="flex-1">
                  <Label htmlFor="minPrice" className="text-xs text-gray-500 mb-1 block">
                    Min Price
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={priceRange[0]}
                    onChange={handleMinPriceChange}
                    className="border-gray-200 rounded-lg focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    min={0}
                    max={priceRange[1]}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="maxPrice" className="text-xs text-gray-500 mb-1 block">
                    Max Price
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={priceRange[1]}
                    onChange={handleMaxPriceChange}
                    className="border-gray-200 rounded-lg focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A]"
                    min={priceRange[0]}
                    max={10000}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-5 border-t border-gray-100 flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={clearFilter}
            className="rounded-xl text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-5"
          >
            Clear All
          </Button>
          <Button
            onClick={handleSearch}
            className="rounded-xl bg-[#013161] hover:bg-[#1E3A8A] text-white border-0 px-6 transition-colors"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}