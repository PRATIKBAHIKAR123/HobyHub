
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";

interface LPopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function LocationPopup({ open, setOpen }: LPopupProps) {

  return (

      <PopoverContent className="w-[300px] shadow-md p-4">
        <h3 className="text-lg font-semibold">Choose your location</h3>
        <p className="text-gray-500 text-sm">Select a location to see hobby options</p>
        
        {/* Input Field */}
        <Input placeholder="Enter location" className="mt-3" />

        {/* Buttons */}
        <div className="mt-4 space-y-2">
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Search By Location</Button>
          <hr />
          <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-600">Detect My Location</Button>
        </div>
      </PopoverContent>
   
  );
}
