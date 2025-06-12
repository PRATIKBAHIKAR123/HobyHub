import { Facebook, Instagram,  } from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function Footer() {

  return (
    <footer className="bg-[#2D388A] text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Quick Links */}
        <div>
          <h3 className={`${inter.variable} text-white text-lg font-bold uppercase mb-4`}>QUICK LINKS</h3>
          <ul className="space-y-4">
            <li><a href="#" className={`${inter.variable} hover:underline text-white text-[12.19px] font-normal font-['Inter'] leading-snug`}>About Us</a></li>
            <li><a href="#" className={`${inter.variable} hover:underline text-white text-[12.19px] font-normal font-['Inter'] leading-snug`}>FAQs</a></li>
            <li><a     href="/termsandconditions"
    target="_blank" className={`${inter.variable} hover:underline text-white text-[12.19px] font-normal font-['Inter'] leading-snug`}>Terms of Service</a></li>
            <li><a href="/policy"
    target="_blank" className={`${inter.variable} hover:underline text-white text-[12.19px] font-normal font-['Inter'] leading-snug`}>Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white text-lg font-bold font-['Inter'] uppercase leading-normal mb-4">SOCIAL MEDIA</h3>
          <div className="flex flex-col space-y-4">
            <a href="#" className="flex space-x-2 hover:text-gray-300">
              <Facebook /> <span className="text-white text-[12.19px] font-normal font-['Inter']">Facebook</span>
            </a>
            <a href="#" className="flex space-x-2 hover:text-gray-300">
              <Instagram /> <span className="text-white text-[12.19px] font-normal font-['Inter']">Instagram</span>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-lg font-bold font-['Inter'] uppercase leading-normal mb-4">CONTACT INFO</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2">
            <Image src={"/Icons/office.png"} alt={"office"} width={15} height={15}/> <span className="text-white text-[12.19px] font-normal font-['Inter']">HOBHUB Global Pvt Ltd</span>
            </li>
            <li className="flex items-center space-x-2">
            <Image src={"/Icons/phone.png"} alt={"phone"} width={15} height={15}/> <span className="text-white text-[12.19px] font-normal font-['Inter']">+91 8010876948</span>
            </li>
            <li className="flex items-center space-x-2">
              <Image src={"/Icons/whatsapp.png"} alt={"whatsapp"} width={15} height={15}/> <span className="text-white text-[12.19px] font-normal font-['Inter']">+91 8010876948</span>
            </li>
            <li className="flex items-center space-x-2">
            <Image src={"/Icons/mail.png"} alt={"mail"} width={15} height={15}/> <span className="text-white text-[12.19px] font-normal font-['Inter']">info@hobyhub.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center justify-center text-white text-[12.19px] font-normal font-['Inter'] leading-snug">hobyhub.com is part of HOBHUB Global Pvt ltd, Copyright © 2024 hobyhub.com. All rights reserved.</div>
    </footer>
  );
}
