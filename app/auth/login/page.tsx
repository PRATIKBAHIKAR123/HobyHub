"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { generateOTP } from "@/services/authService";
import { toast } from "sonner";
import { setStoredPhoneNumber } from "@/utils/localStorage";
import { ImageCarousel } from "@/components/ImageCarousel";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Validate phone number length
  const isPhoneValid = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);

  const handleGenerateOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await generateOTP(phoneNumber);
      if (isClient) {
        setStoredPhoneNumber(phoneNumber);
      }
      toast.success('OTP Generate successful');
      setMessage("OTP Generate successful!");
      router.push("/auth/otp");
      console.log("Login successful:", message);
    } catch (err) {
      setMessage(String(err));
      toast.error(String(err));
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="px-2 md:px-0">
      <div className="text-[#4f6a85] login-title font-medium text-center mt-2 text-[20px] md:text-[24px] font-['Minion_Pro']">
        Welcome to HobyHub!
      </div>
      <div className="h-auto md:h-[27px] text-[12px] md:text-[14px] relative text-center mt-1 text-[#9c9e9e] trajan-pro font-bold">
        Start getting discovered locally and globally.
      </div>
      <form onSubmit={handleGenerateOTP}>
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-2 justify-center mt-[15px]">
          {/* Login Card */}

          <Card className="w-[95%] md:w-auto px-[12px] md:px-[18px] py-[15px] md:py-[17px] gap-0 rounded-none shadow-sm bg-white md:max-w-[569px] sm:max-w-[350px]">
            <h2 className="text-black text-lg font-bold trajan-pro mt-[8px]">Login</h2>
            <div className="bg-[#fefefe] rounded-[7px] border-[2px] md:border-[3px] border-[#dddfe3] px-[10px] md:px-[14px] py-[14px] md:py-[18px] mt-[20px]">
              {/* Phone Input */}
              <label className="text-[#9d9d9d] text-[12px] md:text-[12.80px] font-bold trajan-pro">Phone Number</label>
              <div className="flex items-center">
                <Select>
                  <SelectTrigger className="w-[28%] md:w-[20%] h-[42px] md:h-[48px] rounded-l-md rounded-r-none border-gray-300 border-r-0">
                    <SelectValue placeholder="+91" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="91">+91</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="text"
                  placeholder="Enter your number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/, ""))}
                  maxLength={10}
                  className="placeholder:text-[#e2e3e5] h-[42px] md:h-[48px] outline-none rounded-l-md rounded-l-none flex-1 border border-gray-300 border-l-0 text-sm md:text-base"
                />
              </div>

              <p className="text-[#c9c9c9] text-[11px] md:text-[12.5px] trajan-pro mt-2">
                We ll send you an OTP via WhatsApp and SMS to verify your account.
              </p>

              {/* Features */}
              <ul className="text-[#b6b6b7] text-xs md:text-sm trajan-pro mt-3 space-y-1">
                <li>✔ Get discovered by local & international learners easily</li>
                <li>✔ Showcase your workshops & skills</li>
                <li>✔ Connect with passionate hobbyists</li>
              </ul>
            </div>

            <Card className="md:hidden my-3 sm:block w-full">
              <CardContent className="p-0">
                <ImageCarousel
                  images={[
                    "/images/mobile.png",
                    "/images/computer-security-with-login-password-padlock%201.png",
                    "/images/verification-code.jpg",
                    "/images/mobile-encryption.jpg"
                  ]}
                  width={240}
                  height={200}
                  className="w-auto h-[200px]"
                />
              </CardContent>
            </Card>

            {/* Checkbox & Policy */}
            {/* <div className="flex items-start md:items-center gap-2 mt-[15px]">
            <Checkbox
              id="terms"
              className="mt-1 md:mt-0"
              checked={policyChecked}
              onCheckedChange={(checked) => setPolicyChecked(checked === true)}
            />
            <label htmlFor="terms" className="text-[#c6c7c7] text-[10px] md:text-xs trajan-pro font-bold">
              By proceeding, you agree to our
              Terms & Conditions and
              Privacy Policy
            </label>
          </div> */}
            <span className="text-[#9d9d9d] text-[10px] md:text-[11.80px] py-3 mt-2 font-bold trajan-pro">Dont have an account? <a className="hover:cursor-pointer text-[#3e606e]" onClick={() => router.push("sign-up")}>Sign Up!</a></span>
            {/* Button */}
            <div className="flex justify-center md:justify-start">
              <Button className={`w-full md:w-[20%] app-bg-color text-sm rounded-lg border border-[#90a2b7] trajan-pro cursor-pointer ${isPhoneValid ? " text-white" : " text-[#d4dde8]"}`} disabled={!isPhoneValid}>
                Send OTP
              </Button>
            </div>
          </Card>

          {/* Illustration */}
          <div className="hidden md:block">
            <Card className="rounded-none shadow-sm md:w-[585px] sm:w-[350px] px-[18px] py-[17px]">
              <CardContent className="p-0">
                <ImageCarousel
                  images={[
                    "/images/mobile.png",
                    "/images/computer-security-with-login-password-padlock%201.png",
                    "/images/verification-code.jpg",
                    "/images/mobile-encryption.jpg"
                  ]}
                  width={445}
                  height={340}
                  className="w-[418px] h-[340px]"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}