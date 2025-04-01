
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useSidebar } from "../sidebar/sidebarContext";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { AuthDialog } from "../auth/login/authpopup";
import SearchPopup from "../homepage/FilterPopup";
import LocationPopup from "../homepage/locationPopup";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import useLocation from "../hooks/useLocation";

export default function HomeNavbar() {
    const { toggleSidebar } = useSidebar();
    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);


    const [isOnline, setIsOnline] = useState(false); 

    // Sample data (Replace with API results)
    const options = ["Read", "Dance", "Music", "Rock Climbing", "Riding", "running", "running", "running", "running"];

    // Filter results based on input
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);

        if (value.length > 1) {
            const filtered = options.filter((option) =>
                option.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredOptions(filtered);
            setShowDropdown(filtered.length > 0);
        } else {
            setShowDropdown(false);
        }
    };

    // Handle selection
    const handleSelect = (option: string) => {
        setSearchText(option);
        setShowDropdown(false);
    };
    
    return (
        <>
            <div className="hidden md:block sticky top-0 z-50">
                <div className="w-full py-2 h-[67.88px] bg-[#003161] border-b border-[#dee2e6] justify-between flex">
                    <div className="w-20 pl-[2.25rem]">
                        <Image src="/images/HobyHub.ai.png" alt="Logo" width={220} height={48} />
                    </div>
                    <div className="bg-white/10 items-center rounded-lg px-4 gap-4 py-2 flex ">
                        <LocationSelector />

                        <div className="min-w-[515px] flex-grow w-7/12 h-[44.38px] p-[3.19px] bg-white rounded-md shadow-[0px_8px_16px_0px_rgba(0,0,0,0.15)] flex items-center">
                            {/* Input Field */}
                            <Input
                                type="text"
                                placeholder="Search"
                                value={searchText}
                                onChange={handleSearch}
                                className="w-full h-full px-3 text-[#212529]/75 text-[12.88px] font-normal font-['Inter'] invisible-border bg-white rounded-md"
                            />
                            {/* Autocomplete Dropdown */}
                            {showDropdown && (
                                <ul className=" w-[510px] search-list mt-1 ">
                                    {filteredOptions.map((option, index) => (
                                        <li
                                            key={index}
                                            className="p-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSelect(option)}
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* Search Icon */}
                            <div className="px-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M14.8599 9.93994C14.8599 11.3743 14.3942 12.6993 13.6099 13.7743L17.5661 17.7337C17.9567 18.1243 17.9567 18.7587 17.5661 19.1493C17.1755 19.5399 16.5411 19.5399 16.1505 19.1493L12.1942 15.1899C11.1192 15.9774 9.79421 16.4399 8.35986 16.4399C4.76921 16.4399 1.85986 13.5306 1.85986 9.93994C1.85986 6.34934 4.76921 3.43994 8.35986 3.43994C11.9505 3.43994 14.8599 6.34934 14.8599 9.93994ZM8.35986 14.4399C8.95076 14.4399 9.53596 14.3235 10.0819 14.0974C10.6279 13.8713 11.124 13.5398 11.5418 13.1219C11.9597 12.7041 12.2912 12.208 12.5173 11.662C12.7435 11.1161 12.8599 10.5309 12.8599 9.93994C12.8599 9.34902 12.7435 8.76381 12.5173 8.21785C12.2912 7.67189 11.9597 7.17579 11.5418 6.75796C11.124 6.34014 10.6279 6.00864 10.0819 5.78246C9.53596 5.55627 8.95076 5.43994 8.35986 5.43994C7.76896 5.43994 7.18376 5.55627 6.6378 5.78246C6.09184 6.00864 5.59574 6.34014 5.17792 6.75796C4.7601 7.17579 4.42861 7.67189 4.20242 8.21785C3.97624 8.76381 3.85986 9.34902 3.85986 9.93994C3.85986 10.5309 3.97624 11.1161 4.20242 11.662C4.42861 12.208 4.7601 12.7041 5.17792 13.1219C5.59574 13.5398 6.09184 13.8713 6.6378 14.0974C7.18376 14.3235 7.76896 14.4399 8.35986 14.4399Z"
                                        fill="#212529"
                                    />
                                </svg>
                            </div>
                        </div>

                        <FilterButton setIsFilterPopupOpen={setIsFilterPopupOpen} />
                        <div className="px-3 w-full">
                            <div className="flex-col float-right items-center gap-2 cursor-pointer">
                                <Switch className="w-[3.2em] data-[state=checked]:bg-[#1e90ff] data-[state=unchecked]:bg-[#808080] [&_[data-slot='switch-thumb']]:data-[state=checked]:translate-x-8 [&_[data-slot='switch-thumb']]:data-[state=unchecked]:translate-x-0"
                                    onCheckedChange={(checked) => setIsOnline(checked)}  />
                                <Label className="text-center text-[#f8f9fa] text-[9.94px] font-normal font-['Inter'] leading-[18px]"> {isOnline ? "Online Classes" : "Offline Classes"}</Label>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4">
                        <Link onClick={() => setShowAuthModal(true)} href={""}>
                            <Image src="/Icons/heart.svg" alt="Logo" width={25} height={25} />
                        </Link>
                        <Link href={'/vendor/profile'} >
                            <Image src="/Icons/user.svg" alt="Logo" width={25} height={25} />
                        </Link>
                        <div data-svg-wrapper className="justify-center items-center col:flex" onClick={toggleSidebar}>
                            <Image src="/Icons/hamburger.svg" alt="Logo" width={25} height={25} className="ml-1" />
                            <div className="text-[#f8f9fa] text-sm font-normal font-['Inter'] leading-snug">Menu</div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Mobile Navbar */}
            <div className="md:hidden sm:block sticky top-0 z-50 max-w-full overflow-hidden">
                <div className="w-screen max-w-[100%] bg-[#003161] border-b border-[#dee2e6]">
                    {/* Top Row: Logo and Icons */}
                    <div className="flex justify-between">
                        <div className="p-1">
                            <Image src="/images/HobyHub.ai.png" alt="Logo" width={152} height={36} />
                        </div>
                        <div className="flex gap-2 p-1">
                            <Link onClick={() => setShowAuthModal(true)} href={""}>
                                <Image src="/Icons/heart.svg" alt="Logo" width={24} height={30} />
                            </Link>
                            <Link href={'/auth/login'} >
                                <Image src="/Icons/user.svg" alt="Logo" width={24} height={30} />
                            </Link>
                        </div>
                    </div>

                    {/* Middle Row: Menu, Search, Filter */}
                    <div className="flex justify-between px-1 gap-1">
                        <div data-svg-wrapper className="flex-col text-center align-center" onClick={toggleSidebar}>
                            <Image src="/Icons/hamburger.svg" className="inline-flex" alt="Logo" width={22} height={22} />
                            <div className="text-[#f8f9fa] text-[11px] md:text-sm font-normal font-['Inter'] leading-snug">Menu</div>
                        </div>
                        <SearchInput
                            searchText={searchText}
                            handleSearch={handleSearch}
                            showDropdown={showDropdown}
                            filteredOptions={filteredOptions}
                            handleSelect={handleSelect}

                        />
                        <div className="min-w-fit"> {/* Add min-w-fit to ensure Filter button doesn't shrink */}
                            <FilterButton setIsFilterPopupOpen={setIsFilterPopupOpen} />
                        </div>                    </div>

                    {/* Bottom Row: Location and Switch */}
                    <div className="bg-white/10 flex px-2 py-[2px] justify-between items-center mt-[8px]">
                        <LocationSelector />
                        <div className="pl-[3px] pt-[3px] pb-0.5 rounded-[20px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] justify-between items-center inline-flex gap-2">
                            <Label className="text-center text-[#f8f9fa] text-[9.94px] font-normal font-['Inter'] leading-[18px]">
                                {isOnline ? "Online Classes" : "Offline Classes"}
                            </Label>
                            <Switch className="w-[3.2em] data-[state=checked]:bg-[#1e90ff] data-[state=unchecked]:bg-[#808080] [&_[data-slot='switch-thumb']]:data-[state=checked]:translate-x-8 [&_[data-slot='switch-thumb']]:data-[state=unchecked]:translate-x-0"
                                checked={isOnline}
                                onCheckedChange={(checked) => setIsOnline(checked)} />
                        </div>
                    </div>
                </div>
            </div>

            <AuthDialog open={showAuthModal} setOpen={setShowAuthModal} />
            <SearchPopup open={isFilterPopupOpen} setOpen={setIsFilterPopupOpen} />
        </>
    );
}

type SearchInputProps = {
    searchText: string;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    showDropdown: boolean;
    filteredOptions: string[]; // Adjust the type if your options are objects
    handleSelect: (value: string) => void; // Update the type as per your data

};

const SearchInput = ({ searchText, handleSearch, showDropdown, filteredOptions, handleSelect }: SearchInputProps) => {
    return (
        <div className="min-w-[280px] md:w-[515px] flex-grow w-7/12 h-[44.38px] p-[3.19px] bg-white rounded-md shadow-[0px_8px_16px_0px_rgba(0,0,0,0.15)] flex items-center">
            {/* Input Field */}
            <Input
                type="text"
                placeholder="Search"
                value={searchText}
                onChange={handleSearch}
                className="w-full h-full px-3 text-[#212529]/75 text-[12.88px] font-normal font-['Inter'] invisible-border bg-white rounded-md"
            />
            {/* Autocomplete Dropdown */}
            {showDropdown && (
                <ul className=" w-[510px] search-list mt-1 ">
                    {filteredOptions.map((option: string, index: number) => (
                        <li
                            key={index}
                            className="p-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
            {/* Search Icon */}
            <div className="px-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.8599 9.93994C14.8599 11.3743 14.3942 12.6993 13.6099 13.7743L17.5661 17.7337C17.9567 18.1243 17.9567 18.7587 17.5661 19.1493C17.1755 19.5399 16.5411 19.5399 16.1505 19.1493L12.1942 15.1899C11.1192 15.9774 9.79421 16.4399 8.35986 16.4399C4.76921 16.4399 1.85986 13.5306 1.85986 9.93994C1.85986 6.34934 4.76921 3.43994 8.35986 3.43994C11.9505 3.43994 14.8599 6.34934 14.8599 9.93994ZM8.35986 14.4399C8.95076 14.4399 9.53596 14.3235 10.0819 14.0974C10.6279 13.8713 11.124 13.5398 11.5418 13.1219C11.9597 12.7041 12.2912 12.208 12.5173 11.662C12.7435 11.1161 12.8599 10.5309 12.8599 9.93994C12.8599 9.34902 12.7435 8.76381 12.5173 8.21785C12.2912 7.67189 11.9597 7.17579 11.5418 6.75796C11.124 6.34014 10.6279 6.00864 10.0819 5.78246C9.53596 5.55627 8.95076 5.43994 8.35986 5.43994C7.76896 5.43994 7.18376 5.55627 6.6378 5.78246C6.09184 6.00864 5.59574 6.34014 5.17792 6.75796C4.7601 7.17579 4.42861 7.67189 4.20242 8.21785C3.97624 8.76381 3.85986 9.34902 3.85986 9.93994C3.85986 10.5309 3.97624 11.1161 4.20242 11.662C4.42861 12.208 4.7601 12.7041 5.17792 13.1219C5.59574 13.5398 6.09184 13.8713 6.6378 14.0974C7.18376 14.3235 7.76896 14.4399 8.35986 14.4399Z"
                        fill="#212529"
                    />
                </svg>
            </div>
        </div>
    );
};

const LocationSelector = () => {
    const { location: choosedLocation, setLocation: setChoosedLocation, detectLocation } = useLocation();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        if (!choosedLocation) {
            detectLocation();  // ✅ Fetch location when component mounts
        }
    }, [choosedLocation, detectLocation]);

    const handleLocationChange = (newLocation: string) => {
        setChoosedLocation(newLocation);
        setTimeout(() => {
            setIsPopoverOpen(false);
        }, 200); // ✅ Close Popover after selection
    };

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger onClick={(e) => {
                e.stopPropagation(); // Prevents immediate closing on input selection
                setIsPopoverOpen(!isPopoverOpen);
            }}>
                <div className=" flex-shrink-0 justify-center gap-[3px] items-center inline-flex hover:cursor-pointer ">
                    <Image src="/Icons/location.svg" alt="Logo" width={13} height={15} />
                    <div className="text-center text-[#f8f9fa] text-[10.31px] font-normal font-['Inter'] truncate max-w-[120px] leading-[18px] ">
                        {choosedLocation || ""}  {/* ✅ Show "Detecting..." until location is set */}
                    </div>
                </div>
            </PopoverTrigger>
            <LocationPopup onLocationChange={handleLocationChange} />
        </Popover>
    );
};

type FilterButtonProps = {
    setIsFilterPopupOpen: (value: boolean) => void; // Update the type as per your data
};

const FilterButton = ({ setIsFilterPopupOpen }: FilterButtonProps) => {
    return (
        <div className="md:w-3/12 md:flex md:flex-row flex-col items-center justify-between">
            <div className="px-1">
                <button className="text-white flex md:flex-row flex-col items-center" onClick={() => setIsFilterPopupOpen(true)}>
                    <Image src="/Icons/filter.svg" alt="Logo" width={28} height={20} />
                    <span className="text-[#f8f9fa] text-[11px] md:text-sm font-normal font-['Inter']">Filter</span>
                </button>
            </div>
        </div>

    )
}
