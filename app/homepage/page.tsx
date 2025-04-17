"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "../footer/footer";
import { Categories } from "./categories";
import HobbyGrid from "./hobbygrid";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useSortFilter } from "@/contexts/SortFilterContext";
import HomepageRedirectWithParams from "./params";

export default function Homepage() {
    const [distance, setDistance] = useState("10");
    const { sortFilter, setSortFilter } = useSortFilter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <HomepageRedirectWithParams />
            <Categories />
            <div className="w-full h-[30px] pr-8 bg-[#f1f1f1] md:justify-end justify-center items-center gap-[3.41px] inline-flex">
                <Select value={distance} onValueChange={setDistance}>
                    <SelectTrigger className="self-stretch pl-[10px] pr-[5px] bg-white rounded-[5px] border-2 border-[#bfbebe] justify-between items-center inline-flex min-w-[144px] md:min-w-[74px] max-h-[30px] text-black text-[13.12px] font-semibold font-['Inter'] leading-[14px] [&_svg:last-child]:hidden">
                        <div className="flex-1 text-center">
                            <SelectValue placeholder="Select Distance" />
                        </div>
                        <ChevronDown className="w-4 h-4 text-black peer-focus:text-black" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2">2 KM</SelectItem>
                        <SelectItem value="5">5 KM</SelectItem>
                        <SelectItem value="10">10 KM</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortFilter} onValueChange={setSortFilter}>
                    <SelectTrigger className="self-stretch pl-[10px] pr-[5px] bg-white rounded-[5px] border-2 border-[#bfbebe] justify-between min-w-[144px] md:min-w-[149px] items-center inline-flex max-h-[30px] text-black text-[13.12px] font-semibold font-['Inter'] leading-[14px] [&_svg:last-child]:hidden">
                        <div className="flex-1 text-center">
                            <SelectValue placeholder="Select Filter" />
                        </div>
                        <ChevronDown className="w-4 h-4 text-black peer-focus:text-black" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="NearMe">Near Me</SelectItem>
                        <SelectItem value="Popular">Popular</SelectItem>
                        <SelectItem value="WhatsNew">Whats New</SelectItem>
                        <SelectItem value="HighToLow">Price (High to Low)</SelectItem>
                        <SelectItem value="LowToHigh">Price (Low to High)</SelectItem>                      
                    </SelectContent>
                </Select>
            </div>
            <HobbyGrid />
            <Footer />
        </div>
    );
}