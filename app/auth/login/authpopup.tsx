"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface PopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function AuthDialog({ open, setOpen }: PopupScreenProps) {
  const router = useRouter();

  const handleLogin = () => {
    setOpen(false);
    router.push('/auth/login');
  };

  const handleSignUp = () => {
    setOpen(false);
    router.push('/auth/sign-up');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogOverlay className="bg-transparent/50 backdrop-blur-[2px] fixed inset-0" />
      <DialogContent className="sm:max-w-[425px] border rounded-lg shadow-lg p-6" onPointerDownOutside={(e) => e.preventDefault()} showCloseButton={false}>
        <div className="flex-col gap-4 py-4 text-center">
          <div className="justify-center text-black text-[28px] font-medium font-['Minion_Pro']">Login and View</div>
          <div className="justify-center text-black text-lg font-medium font-['Minion_Pro']">You have to login first to see details</div>
        </div>
        <DialogFooter className="sm:justify-center justify-center mt-4">
          <Button
            type="button"
            className="rounded-[7px] bg-white border border-[#3e606c] text-black hover:text-white text-md font-medium font-['Minion_Pro']"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          <Button
            type="submit"
            className="bg-[#3e606c] rounded-[7px] text-md font-medium font-['Minion_Pro']"
            onClick={handleLogin}
          >
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}