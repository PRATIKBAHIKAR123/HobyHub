import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface InquiryPopupScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryPopupScreen({ isOpen, onClose }: InquiryPopupScreenProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
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
                  placeholder="Email ID"
                  required
                  className="h-[52px] border-[#05244f]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-black text-[11.6px] font-semibold">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="Mobile Number"
                  required
                  className="h-[52px] border-[#05244f]"
                />
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