import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  width?: number;
  height?: number;
  className?: string;
  autoSlideInterval?: number;
}

export function ImageCarousel({ 
  images, 
  width = 445, 
  height = 445, 
  className = "",
  autoSlideInterval = 3000 
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [currentIndex, autoSlideInterval]);

  const handleNextSlide = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevSlide = () => {
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full flex flex-col">
      <style jsx global>{`
        @keyframes slideLeft {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideRight {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideLeft {
          animation: slideLeft 0.5s ease-out forwards;
        }
        .animate-slideRight {
          animation: slideRight 0.5s ease-out forwards;
        }
      `}</style>
      <div className="relative w-full flex justify-center">
        <div className="relative flex justify-center overflow-hidden">
          <div
            className={`transform transition-all duration-500 ease-out ${
              direction === 'right' ? 'animate-slideLeft' : 
              direction === 'left' ? 'animate-slideRight' : ''
            }`}
            onAnimationEnd={() => setDirection(null)}
          >
            <Image
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              width={width}
              height={height}
              className={`object-contain ${className}`}
              priority
            />
          </div>
          
          {/* Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between px-8 md:px-12">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="transform -translate-x-8 md:-translate-x-12 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                handlePrevSlide();
              }}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-[#3E606C]" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="transform translate-x-8 md:translate-x-12 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                handleNextSlide();
              }}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-[#3E606C]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Indicators - Positioned outside the card */}
      <div className="flex justify-center space-x-1">
        {images.map((_, index) => (
          <button
            type="button"
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? "bg-[#3E606C]" : "bg-[#E4E4E4]"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setDirection(index > currentIndex ? 'right' : 'left');
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
} 