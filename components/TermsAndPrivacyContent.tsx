import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TermsAndPrivacyContentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsAndPrivacyContent({ isOpen, onClose }: TermsAndPrivacyContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const content = [
    {
      title: "Terms & Conditions",
      content: `Welcome to HobyHub! These terms and conditions outline the rules and regulations for the use of our platform.

1. Acceptance of Terms
By accessing and using HobyHub, you accept and agree to be bound by these terms and conditions.
`
    },
    {
      title: "Privacy Policy",
      content: `Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.

1. Information We Collect
`
    }
  ];

  const handleNextSlide = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
  };

  const handlePrevSlide = () => {
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + content.length) % content.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-[#3E606C]">{content[currentIndex].title}</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <div className="relative flex justify-center overflow-hidden">
                <div
                  className={`transform transition-all duration-500 ease-out ${
                    direction === 'right' ? 'animate-slideLeft' : 
                    direction === 'left' ? 'animate-slideRight' : ''
                  }`}
                  onAnimationEnd={() => setDirection(null)}
                >
                  <div className="whitespace-pre-line text-sm text-gray-700">
                    {content[currentIndex].content}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="transform -translate-x-8 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
                onClick={handlePrevSlide}
              >
                <ChevronLeft className="h-5 w-5 text-[#3E606C]" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="transform translate-x-8 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
                onClick={handleNextSlide}
              >
                <ChevronRight className="h-5 w-5 text-[#3E606C]" />
              </Button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-1">
              {content.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index ? "bg-[#3E606C]" : "bg-[#E4E4E4]"
                  }`}
                  onClick={() => {
                    setDirection(index > currentIndex ? 'right' : 'left');
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 