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
import { removeStored, removeStoredToken } from "@/utils/localStorage";

interface LogOutConfirmationProps {
  // Function to call when user confirms logout
  onConfirm?: () => void;
  // For controlled external trigger
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function LogOutConfirmation({ 
  onConfirm,
  buttonText = "Log Out",
}: LogOutConfirmationProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    // Default logout logic (can be overridden with onConfirm prop)
    if (onConfirm) {
      onConfirm();
      removeStoredToken();
      removeStored('userData');
      router.push("/auth/login");
    } else {
      // Default logout behavior - modify as needed
      
    }
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
      <DropdownMenuItem onSelect={(event) => {
      // Prevent the default behavior which closes the dropdown
      event.preventDefault();
    }}>{buttonText}</DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out of the application and will need to sign in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Log Out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}