"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { generateOTP } from "@/services/authService";
import { toast } from "sonner";
import { setStoredPhoneNumber } from "@/utils/localStorage";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Loader2 } from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Script from "next/script";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const RECAPTCHA_SITE_KEY = "6Ldj0norAAAAAP0qALi7WpRKtUWf4Yk6bC_B3zJv";

  useEffect(() => {
    setIsClient(true);
    // Focus the input field after component mounts
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, []);

  // Validate phone number length (excluding country code)
  const isPhoneValid = phoneNumber.length >= 8 && phoneNumber.length <= 15 && /^\d+$/.test(phoneNumber);

  const handleGenerateOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Get reCAPTCHA v3 token
      const token = await (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "login" });
      // Send the full phone number and reCAPTCHA token to the API
      await generateOTP(phoneNumber, token);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Load reCAPTCHA v3 script */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
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
                <div className="mt-2">
                  <PhoneInput
                    country={'in'}
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value);
                    }}
                    inputClass="!h-[42px] md:!h-[48px] !pl-[60px] !w-full !border !border-gray-300 !rounded-md !text-sm md:!text-base"
                    buttonClass="!border !border-gray-300 !rounded-l-md !rounded-r-none"
                    containerClass="!w-full"
                    inputProps={{
                      name: 'phoneNumber',
                      required: true,
                      autoFocus: true,
                      placeholder: "Enter your number"
                    }}
                    enableSearch={true}
                    searchPlaceholder="Search country..."
                    searchNotFound="No country found"
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
              <span className="text-[#9d9d9d] text-[10px] md:text-[11.80px] py-3 mt-2 font-bold trajan-pro">Dont have an account? <a className="hover:cursor-pointer text-[#3e606e]" onClick={() => router.push("sign-up")}>Sign Up!</a><span className="hover:text-blue-200 text-[10px] md:text-[11.80px] text-[#3f3f3f] float-right hover:cursor-pointer  trajan-pro" onClick={() => router.push('/auth/reset-password')}>Reset Password</span></span>
              {/* Button */}
              <div className="flex justify-center md:justify-start">
                <Button 
                  className={`${isLoading ? 'w-full md:w-[30%]' : 'w-full md:w-[20%]'} app-bg-color text-sm rounded-lg border border-[#90a2b7] trajan-pro cursor-pointer ${isPhoneValid ? " text-white" : " text-[#d4dde8]"}`} 
                  disabled={!isPhoneValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      Sending...
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Send OTP"
                  )}
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
    </>
  );
}