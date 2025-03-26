import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SearchPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SearchPopup({ open, setOpen }: SearchPopupProps) {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState('18');
  const times = ['Morning', 'Afternoon', 'Evening', 'Night']
  const [time, setTime] = useState("Morning");

  const clearFilter: () => void = () => {
     setGender("Male");
      setPriceRange([0, 100000]);
      setTime("Morning");
      setAge('18');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg md:max-w-xl p-6 rounded-lg shadow-lg bg-white [&>button:last-child]:hidden">
        <DialogHeader className="flex-row justify-between items-center">
          <DialogTitle className="text-lg font-bold text-left">Search</DialogTitle>
          <DialogClose className="text-red-500 hover:bg-red-100 p-1 rounded-full">
            ✖
          </DialogClose>
        </DialogHeader>

        {/* Age Input */}
        <Card className="px-3">
        <div className="space-y-2">
          <Label className="font-semibold">Whats Your Age?</Label>
          <Select value={age.toString()} onValueChange={(value) => setAge(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Search By Age" />
                  </SelectTrigger>
                      <SelectContent>
                          {Array.from({ length: 69 }, (_, i) => i + 1).map((age) => (
                              <SelectItem key={age} value={age.toString()}>
                                  {age}
                              </SelectItem>
                          ))}
                      </SelectContent>
                </Select>
        </div>
        </Card>
        {/* Gender Selection */}
        <Card className="px-3">
        <div className="space-y-2">
          <Label className="font-semibold">Select Gender: {gender}</Label>
          <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4">
            <Label className="flex items-center space-x-2">
              <RadioGroupItem value="Male" />
              <span>Male</span>
            </Label>
            <Label className="flex items-center space-x-2">
              <RadioGroupItem value="Female" />
              <span>Female</span>
            </Label>
          </RadioGroup>
        </div>
        </Card>

        {/* Time Input */}
        <Card className="px-3">
        <div className="space-y-2">
          <Label className="font-semibold">Select Time</Label>
          <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Search By Time" />
                  </SelectTrigger>
                      <SelectContent>
                          {times.map((time) => (
                              <SelectItem key={time} value={time.toString()}>
                                  {time}
                              </SelectItem>
                          ))}
                      </SelectContent>
                </Select>
        </div>
        </Card>

        {/* Price Range Slider */}
        <Card className="px-3">
        <div className="space-y-2">
          <Label className="font-semibold">Select Price Range: {priceRange[0]} - {priceRange[1]}</Label>
          <Slider
            min={0}
            max={100000}
            step={100}
            defaultValue={priceRange}
            value={priceRange}
            onValueChange={setPriceRange}
          />
        </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button variant="destructive" className="rounded-2xl" onClick={clearFilter}>Clear All</Button>
          <Button variant="destructive" className="rounded-2xl">
            <Search />Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
