"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthNavbar() {
  return (
    <nav className="w-full min-h-[7vh] md:min-h-[10vh] app-bg-color content-center p-4">
      <div className="container mx-auto flex justify-center">
        <div className="text-white font-bold text-lg flex items-center gap-2">
          <Link href="/">
            <Image src="/images/HobyHub.ai.png" alt="Logo" width={254}
              height={58}
              className="w-[26vw] md:max-w-[254px]  max-h-[48px]" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
