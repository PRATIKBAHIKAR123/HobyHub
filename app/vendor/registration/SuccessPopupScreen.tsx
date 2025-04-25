'use client';

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SuccessPopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  username: string;
}

export default function SuccessPopupScreen({ open, setOpen, username }: SuccessPopupScreenProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-[#003161] opacity-[50%] fixed inset-0" />
      <DialogContent className="bg-white p-6 rounded-xl max-w-md mx-auto text-center">
        <div className="flex flex-col items-center gap-4">
          {/* Success Icon */}
          <div className="text-[#05244f] mb-2">
            <Image 
              src="/Icons/smile.svg" 
              alt="Success" 
              width={48} 
              height={48}
              priority
            />
          </div>

          {/* Title */}
          <h2 className="text-[24px] font-medium text-center">
            Thanks for submitting the registration form
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 mb-2">
            We will contact within 1 working day for any additional information needed.
          </p>

          {/* Vendor ID */}
          <div className="bg-gray-100 px-6 py-3 rounded-md w-full">
            <p className="text-center text-gray-700">
              Vendor ID: {username}
            </p>
          </div>

          {/* Okay Button */}
          <Button
            onClick={() => setOpen(false)}
            className="w-32 bg-[#05244f] text-white hover:bg-[#03162f]"
          >
            Okay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 