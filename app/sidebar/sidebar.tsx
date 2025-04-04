"use client";


import { useRouter } from "next/navigation";
import { useSidebar } from "./sidebarContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

// Menu items.
const menuItems = [
  { name: 'Search',showHr:true, submenus: [
    { name: "Hobby Class",  link: "/hobby-list",isDisabled:false  },
    { name: "PlayZones (Coming Soon)",  link: "/",isDisabled:true  },
    { name: "Shopping (Coming Soon)",  link: "/",isDisabled:true  },
  ]},
  { name: 'Program',showHr:true, submenus:[{ name: "Join Hobby Hub",  link: "/vendor/registration",isDisabled:false  },
    { name: "Selling (Coming Soon)",  link: "/",isDisabled:true },
  ]},
  { name: 'Other',showHr:true, submenus:[{ name: "Community (Coming Soon)", isDisabled:true,link: "/",  },
    { name: "Events (Coming Soon)",  link: "/",isDisabled:true },
    { name: "Blogs (Coming Soon)",  link: "/",isDisabled:true },
    { name: "About Us",  link: "/",isDisabled:false },
  ]},   
  ];

export function AppSidebar() {
    const isMobile = useIsMobile();
    const router = useRouter();
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleNavigation = (route: string, requiresAuth: boolean = false) => {
        if (requiresAuth && !isLoggedIn) {
            router.push('/auth/login');
        } else {
            router.push(route);
        }
        toggleSidebar();
    };

    return (
        <Sheet open={isSidebarOpen} onOpenChange={toggleSidebar}>
            <SheetContent side={isMobile ? "left" : "right"} className="max-w-[50%] w-[400px] text-black px-[2px]">
                <nav className="mt-[36px]">
                    {menuItems.map((item, index) => (
                        <div key={index}>
                            <span className="px-6 text-[24px] items-center mb-4">{item.name}</span>
                            {item.submenus.map((i, mindex) => (
                                <div
                                    key={mindex}
                                    onClick={() => !i.isDisabled && handleNavigation(i.link, i.name === "Hobby Class")}
                                    className={`flex items-center gap-3 px-6 py-[0.5rem] hover:cursor-pointer ${
                                        i.isDisabled ? "text-gray-400 " : "text-gray-800 hover:text-black"
                                    }`}
                                >
                                    <span className="text-[14px]">{i.name}</span>
                                </div>
                            ))}
                            {item.showHr && <Separator className="my-[10px]" />}
                        </div>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
