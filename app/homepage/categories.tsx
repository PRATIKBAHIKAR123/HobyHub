'use client';

import * as React from "react"

import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAllSubCategories } from "@/services/hobbyService";

interface SubCategory {
  categoryId: number;
  title: string;
  imagePath: string | null;
  id: number;
}

interface Category {
  title: string;
  img: string;
  id: number;
  subcategories: SubCategory[];
}

const categories: Category[] = [
  { title: "Games", img: "/images/games.png", id: 1, subcategories: [] },
  { title: "Artistry", img: "/images/artistery.png", id: 10, subcategories: [] },
  { title: "Martial Arts", img: "/images/martial arts.png", id: 4, subcategories: [] },
  { title: "Music", img: "/images/music.png", id: 12, subcategories: [] },
  { title: "Perform", img: "/images/perform.png", id: 3, subcategories: [] },
  { title: "Read and Write", img: "/images/read and write.png", id: 6, subcategories: [] },
  { title: "Wellness", img: "/images/wellness.png", id: 11, subcategories: [] },
  { title: "Cooking", img: "/images/cooking.png", id: 8, subcategories: [] },
  { title: "Stem", img: "/images/stem.png", id: 9, subcategories: [] },
  { title: "Language", img: "/images/language.png", id: 2, subcategories: [] },
];

export function Categories() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [categoriesWithSubs, setCategoriesWithSubs] = useState<Category[]>(categories);
  const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all subcategories once when component mounts
  useEffect(() => {
    const fetchAllSubCategories = async () => {
      try {
        const subCategories = await getAllSubCategories();
        setAllSubCategories(subCategories);
        
        // Update categories with their respective subcategories
        setCategoriesWithSubs(prev => 
          prev.map(cat => ({
            ...cat,
            subcategories: subCategories.filter(sub => sub.categoryId === cat.id)
          }))
        );
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSubCategories();
  }, []);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  useEffect(() => {
    if (!carouselApi) return;

    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    updateCarouselState();
    carouselApi.on("select", updateCarouselState);

    return () => {
      carouselApi.off("select", updateCarouselState);
    };
  }, [carouselApi]);

  const handleCategoryClick = (_open: boolean, categoryId: number) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className="bg-white md:px-4 sm:px-2 w-full sticky top-32 md:top-16 z-9 border-b-1 border-gray">
      <Carousel setApi={setCarouselApi} opts={{ align: "start" }} className="w-[90%] mx-auto mb-3">
        <CarouselContent className="items-center text-center gap-2 md:gap-4">
          {categoriesWithSubs.map((cat, index) => (
            <CarouselItem key={index} className="basis-1/5 sm:basis-1/4 lg:basis-1/11 md:basis-1/12 hover:-translate-y-1 hover:bg-gray-100">
              <DropdownMenu
                open={activeCategory === cat.id}
                onOpenChange={(open) => handleCategoryClick(open, cat.id)}
                modal={false}
              >
                <DropdownMenuTrigger asChild>
                  <div className="pt-2 pb-[8px] flex-col items-center gap-px inline-flex cursor-pointer">
                    <Image src={cat.img} alt={cat.title} width={50} height={50} />
                    <div className="h-[13px] text-center text-[#003161] text-[12.5px] font-bold font-['Minion_Pro']">
                      {cat.title}
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-[180px] max-h-[60vh] font-['Minion_Pro'] overflow-y-auto custom-scrollbar z-50"
                  align="start"
                  side="bottom"
                  sideOffset={10}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  onInteractOutside={(e) => {
                    e.preventDefault();
                    setActiveCategory(null);
                  }}
                >
                  <div className="grid grid-cols-1 gap-2 p-2">
                    {isLoading ? (
                      <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                    ) : cat.subcategories.length > 0 ? (
                      cat.subcategories.map((subcat) => (
                        <DropdownMenuItem
                          key={subcat.id}
                          onClick={() => setActiveCategory(null)}
                          className="py-5 px-2 text-base text-[16px] hover:bg-gray-100"
                        >
                          {subcat.title}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>No Subcategories</DropdownMenuItem>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Button
        onClick={() => scrollToIndex(currentIndex - 1)}
        className="hidden md:block absolute left-[40px] top-1/2 transform justify-items-center -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-white shadow-lg shadow-[0px_6px_20px_0px_rgba(0,0,0,0.19)] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.20)] hover:bg-gray-100"
      >
        <ChevronLeft className="w-8 h-8 text-[#121111]" strokeWidth={3.0} />
      </Button>

      <Button
        onClick={() => scrollToIndex(currentIndex + 1)}
        className="hidden md:block absolute right-[40px] top-1/2 transform justify-items-center -translate-y-1/2 rounded-full w-8 h-8 p-0 bg-white shadow-lg shadow-[0px_6px_20px_0px_rgba(0,0,0,0.19)] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.20)] hover:bg-gray-100"
      >
        <ChevronRight className="w-8 h-8 text-[#121111]" strokeWidth={3.0} />
      </Button>
      <div className="absolute left-0 right-0 bottom-0 mb-3">
        <div className="w-full border-b border-[#DEE2E6]"></div>
      </div>
    </div>
  );
}
