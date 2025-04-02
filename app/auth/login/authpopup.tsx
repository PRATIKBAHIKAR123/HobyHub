"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation";

interface PopupScreenProps {
    open: boolean;
    setOpen: (open: boolean) => void;
  }

export function AuthDialog({ open, setOpen  }: PopupScreenProps) {
          const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogOverlay className="bg-black/10 backdrop-blur fixed inset-0" />
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex-col gap-4 py-4 text-center">
        <div className="justify-center text-black text-[28px] font-medium font-['Minion_Pro']">Login and View</div>
        <div className="justify-center text-black text-lg font-medium font-['Minion_Pro']">You have to login first to see class location</div>
        </div>
        <DialogFooter className="sm:justify-center justify-center">
        <Button type="button" className="rounded-[7px] bg-white border border-[#3e606c] text-black hover:text-white text-md font-medium font-['Minion_Pro']" onClick={() => router.push('/auth/sign-up')}>Sign Up</Button>
          <Button type="submit" className="bg-[#3e606c] rounded-[7px] text-md font-medium font-['Minion_Pro']" onClick={() => router.push('/auth/login')}>Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
