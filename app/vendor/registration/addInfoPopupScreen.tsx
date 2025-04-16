'use client';

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setShowClassFields: (open: boolean) => void;
  setShowCourseFields: (open: boolean) => void;
  setAccordianOpen: (open: string) => void;
}

export default function PopupScreen({ open, setOpen, setShowClassFields, setShowCourseFields, setAccordianOpen }: PopupScreenProps) {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-[#003161] opacity-[50%] fixed inset-0" />
      <DialogContent className="bg-white p-6 rounded-xl max-w-lg mx-auto text-center">
        <div className="flex justify-center gap-6">
          <Card onClick={() => {
            setShowClassFields(true);
            setOpen(false); // Close dialog after clicking
            setAccordianOpen('item-4')
          }} className="w-40 md:w-55 p-4 cursor-pointer hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-2">
              <Image src={'/Icons/Video.svg'} height={56} width={56} alt="Books" />
              <h3 className="text-lg font-semibold">Class Details</h3>
              <p className="text-gray-500 text-sm">Provide class-related information</p>
            </CardContent>
          </Card>
          <Card onClick={() => {
            setShowCourseFields(true);
            setOpen(false); // Close dialog after clicking
            setAccordianOpen('item-5')
          }} className="w-40 md:w-55 p-4 cursor-pointer hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-2">
              <Image src={'/Icons/Books.svg'} height={56} width={56} alt="Books" />
              <h3 className="text-lg font-semibold">Course Form</h3>
              <p className="text-gray-500 text-sm">Fill in course details</p>
            </CardContent>
          </Card>
        </div>
        <Button variant="outline" onClick={() => setOpen(false)} className="mt-4">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
