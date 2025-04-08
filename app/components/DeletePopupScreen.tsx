import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface DeletePopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
}

export default function DeletePopupScreen({ open, setOpen, onDelete }: DeletePopupScreenProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[400px] p-6">
        <div className="flex flex-col items-center">
          {/* Delete Icon */}
          <div className="mb-4">
            <Image 
              src="/images/delete.png" 
              alt="Delete" 
              width={60} 
              height={60}
              priority
            />
          </div>

          {/* Title */}
          <h2 className="text-[24px] font-medium text-center mb-2">
            Delete
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 mb-6">
            Are you sure want to delete this class.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-[#05244f] text-[#05244f] hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="flex-1 bg-[#05244f] text-white hover:bg-[#03162f]"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 