// File: components/LogOutConfirmation.tsx
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { removeStored, removeStoredToken, getStoredToken } from "@/utils/localStorage";

interface LogOutConfirmationProps {
  // Function to call when user confirms logout
  onConfirm?: () => void;
  // For controlled external trigger
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function LogOutConfirmation({ 
  onConfirm,
}: LogOutConfirmationProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isLoggedIn = !!getStoredToken();

  const handleConfirm = () => {
    if (isLoggedIn) {
      // Default logout logic (can be overridden with onConfirm prop)
      if (onConfirm) {
        onConfirm();
      }
      removeStoredToken();
      removeStored('userData');
      router.push("/auth/login");
    } else {
      router.push("/auth/login");
    }
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(event) => {
          event.preventDefault();
        }}>
          {isLoggedIn ? "Log Out" : "Sign In"}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isLoggedIn ? "Are you sure you want to log out?" : "Sign In Required"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isLoggedIn 
              ? "You will be logged out of the application and will need to sign in again to access your account."
              : "You need to sign in to access this feature."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {isLoggedIn ? "Log Out" : "Sign In"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}