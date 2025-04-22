import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";

interface ConfirmationPopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
  message?: string;
}

export default function ConfirmationPopupScreen({ open, setOpen, message, onDelete }: ConfirmationPopupScreenProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[400px] p-6">
        <div className="flex flex-col items-center">
            <CircleAlert className="mb-4 text-red-500" width={60} height={60} />

          {/* Title */}
          <h2 className="text-[24px] font-medium text-center mb-2">
            Yes
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-[#05244f] text-[#05244f] hover:bg-gray-50"
            >
              No
            </Button>
            <Button
              type="button"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex-1 bg-[#05244f] text-white hover:bg-[#03162f]"
            >
              Yes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 