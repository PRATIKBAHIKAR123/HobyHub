'use client';

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SuccessPopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  username: string;
  onClose: () => void;
}

export default function SuccessPopupScreen({ open, setOpen, username, onClose }: SuccessPopupScreenProps) {
  const router = useRouter();

  // Extract country code and remaining part from username
  const countryCode = username.substring(0, 2);
  const vendorIdWithoutCountryCode = username.substring(2);

  const handleOkayClick = () => {
    // Update user role in localStorage
    try {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        // Update role to Vendor regardless of current role
        userData.Role = "Vendor";
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        // If no userData exists, create new userData with Vendor role
        const newUserData = { Role: "Vendor" };
        localStorage.setItem('userData', JSON.stringify(newUserData));
      }
    } catch (error) {
      console.error('Error updating user role in localStorage:', error);
      // If there's an error, still create basic userData with Vendor role
      try {
        const newUserData = { Role: "Vendor" };
        localStorage.setItem('userData', JSON.stringify(newUserData));
      } catch (fallbackError) {
        console.error('Fallback error creating userData:', fallbackError);
      }
    }

    setOpen(false);
    onClose();
    router.push('/');
  };

  const handleCopyVendorId = async () => {
    try {
      await navigator.clipboard.writeText(vendorIdWithoutCountryCode);
      toast.success("Vendor ID copied successfully!");
    } catch {
      toast.error("Failed to copy Vendor ID");
    }
  };

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

          {/* Vendor ID Section */}
          <div className="w-full">
            <p className="text-center text-gray-700 mb-2 font-medium">Vendor ID:</p>
            <div className="flex items-center gap-2 justify-center">
              {/* Country Code Box */}
              <div className="bg-gray-200 px-3 py-2 rounded-md border border-gray-300">
                <span className="text-gray-700 font-medium">+{countryCode}</span>
              </div>
              
              {/* Vendor ID Box with Copy Icon */}
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 px-3 py-2 rounded-md border border-gray-300 min-w-[120px]">
                  <span className="text-gray-700 font-medium">{vendorIdWithoutCountryCode}</span>
                </div>
                <button
                  onClick={handleCopyVendorId}
                  className="text-blue-600 hover:text-blue-900 flex items-center cursor-pointer p-1"
                  title="Copy Vendor ID"
                >
                  <img src="/Icons/copy.png" alt="Copy Icon" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={handleOkayClick}
            className="w-32 bg-[#05244f] text-white hover:bg-[#03162f]"
          >
            Okay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 