"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

export default function PagesNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <nav className="app-bg-color text-white flex items-center p-4 gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

      </div>
      <div className={`md:flex gap-4 ${isMenuOpen ? "block" : "hidden"} md:block absolute md:static top-16 left-0 w-full bg-blue-900 md:bg-transparent p-4 md:p-0`}>
        <div className=" w-[16%]  bg-[#003161] hidden md:block">
          <Image src="/images/HobyHub.ai.png" alt="Logo" width={206} height={40} className="w-[180px] h-[34px]" onClick={() => router.push("/")} />
        </div>
        {/* <Button variant="ghost" className=" w-full md:w-auto" onClick={() => router.push("/")}>Home</Button> */}
        <Button
          variant="ghost"
          className={clsx(
            "w-full md:w-auto",
            pathname === "/hobby-list/hobby-details-page" && "bg-yellow-400 text-black"
          )}
          onClick={() => router.push("/hobby-list/hobby-details-page")}
        >
          Info
        </Button>

        <Button
          variant="ghost"
          className={clsx(
            "w-full md:w-auto",
            pathname === "/hobby-list" && "bg-yellow-400 text-black"
          )}
          onClick={() => router.push("/hobby-list")}
        >
          Class Details
        </Button>
        <Button variant="ghost" className="w-full md:w-auto">Contact Details</Button>
        <Button variant="ghost" className="w-full md:w-auto">Location</Button>
        <Button variant="ghost" className="w-full md:w-auto">Excellence Score</Button>
      </div>
    </nav>
  );
}
