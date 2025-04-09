import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";

interface InquiryPopupScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryPopupScreen({ isOpen, onClose }: InquiryPopupScreenProps) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateMobileNumber = (number: string) => {
    // Remove any non-digit characters
    const cleanedNumber = number.replace(/\D/g, '');
    
    // Check if the number is exactly 10 digits
    if (cleanedNumber.length !== 10) {
      setMobileError("Mobile number must be exactly 10 digits");
      return false;
    }
    
    // Check if the number contains only digits
    if (!/^\d{10}$/.test(cleanedNumber)) {
      setMobileError("Mobile number must contain only digits");
      return false;
    }
    
    setMobileError("");
    return true;
  };

  const validateEmail = (email: string) => {
    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address (e.g., example@domain.com)");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, '');
    setMobileNumber(numericValue);
    validateMobileNumber(numericValue);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMobileNumber(mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Handle form submission logic here
    toast.success("Your inquiry has been submitted successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0">
        <div className="p-6">
          <h2 className="text-[#05244f] text-[24px] font-medium text-center font-['Minion_Pro'] mb-4">
            Please fill your details!
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <Label className="text-black text-[11.6px] font-semibold">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="First Name"
                  required
                  className="h-[52px] border-[#05244f]"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label className="text-black text-[11.6px] font-semibold">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Last Name"
                  required
                  className="h-[52px] border-[#05244f]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-black text-[11.6px] font-semibold">
                  Email ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="Enter email (e.g., example@domain.com)"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`h-[52px] border-[#05244f] ${emailError ? 'border-red-500' : ''}`}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-black text-[11.6px] font-semibold">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  required
                  value={mobileNumber}
                  onChange={handleMobileChange}
                  maxLength={10}
                  className={`h-[52px] border-[#05244f] ${mobileError ? 'border-red-500' : ''}`}
                />
                {mobileError && (
                  <p className="text-red-500 text-xs mt-1">{mobileError}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <Label className="text-black text-[11.6px] font-semibold">
                Comments <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Write your comments here..."
                required
                className="min-h-[100px] border-[#05244f]"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-[#05244f] text-[#05244f]"
              >
                Close
              </Button>
              <Button
                type="submit"
                className="app-bg-color text-white"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 