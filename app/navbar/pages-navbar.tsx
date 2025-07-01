"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { LogOutConfirmation } from "../auth/logoutConfirmationDialog"; // Make sure this path is correct

export default function PagesNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');

  const routeTo = (link: string) => {
    if (activityId && (link.includes('hobby-details-page') || link.includes('hobby-list') || link.includes('hobby-contact-details-page'))) {
      router.push(`${link}?id=${activityId}`);
    } else {
      router.push(link);
    }
  };

  return (
    <nav className="app-bg-color text-white flex flex-col md:flex-row items-start md:items-center p-4 gap-4 sticky top-0 z-10">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="w-[16%] bg-[#003161] block md:hidden">
          <Image src="/images/HobyHub.ai.png" alt="Logo" width={206} height={40} className="w-[180px] h-[34px]" onClick={() => routeTo("/")} />
        </div>
      </div>
      <div className="flex flex-row overflow-x-auto gap-2 w-full bg-blue-900 rounded-md md:bg-transparent md:p-0 scrollbar-hide items-center">
        <div className="w-[16%] bg-[#003161] hidden md:block">
          <Image src="/images/HobyHub.ai.png" alt="Logo" width={206} height={67} className="w-[220px] h-[48px]" onClick={() => routeTo("/")} />
        </div>
        <Button
          variant="ghost"
          className={clsx("w-auto md:w-auto", pathname === "/hobby-list/hobby-details-page" && "bg-yellow-400 text-black")}
          onClick={() => routeTo("/hobby-list/hobby-details-page")}
        >
          Info
        </Button>
        <Button
          variant="ghost"
          className={clsx("w-auto md:w-auto", pathname === "/hobby-list" && "bg-yellow-400 text-black")}
          onClick={() => routeTo("/hobby-list")}
        >
          Class Details
        </Button>
        <Button
          variant="ghost"
          className={clsx("w-auto md:w-auto", pathname === "/hobby-list/hobby-contact-details-page" && "bg-yellow-400 text-black")}
          onClick={() => routeTo("/hobby-list/hobby-contact-details-page")}
        >
          Contact Details
        </Button>

        {/* 👤 Profile Dropdown Icon at the Right End */}
        <div className="ml-auto pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image src="/Icons/user.svg" alt="User" width={25} height={25} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ProfileDropdown />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

// ✅ ProfileDropdown Component
const ProfileDropdown = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUser, setIsUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    checkUserType();
  }, []);

  const handleLogOut = () => {
    // You can enhance this with token removal or session reset logic
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/auth/login");
  };

  const checkUserType = () => {
    const user = localStorage.getItem('userData');
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsUser(parsedUser.Role !== "Vendor");
    }
  };

  return (
    <>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {isLoggedIn ? (
        <>
          <DropdownMenuItem
            onClick={() => (isUser ? router.push("/profile") : router.push("/vendor/profile"))}
            className="hover:cursor-pointer"
          >
            Profile
          </DropdownMenuItem>
          <LogOutConfirmation onConfirm={handleLogOut} />
        </>
      ) : (
        <>
          <DropdownMenuItem onClick={() => router.push("/auth/login")} className="hover:cursor-pointer">
            Login
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/auth/sign-up")} className="hover:cursor-pointer">
            Sign Up
          </DropdownMenuItem>
        </>
      )}
    </>
  );
};
