"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { generateOTP, loginWithOtp } from "@/services/authService";
import { getUserProfile } from "@/services/userService";
import { toast } from "sonner";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Loader2 } from "lucide-react";

const RECAPTCHA_SITE_KEY = "6Ldj0norAAAAAP0qALi7WpRKtUWf4Yk6bC_B3zJv";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const isOtpComplete = otp.length >= 4 && /^\d+$/.test(otp);
  const [timer, setTimer] = useState(53);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otpFailed, setotpFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isClient = typeof window !== "undefined";
  const recaptchaLoaded = useRef(false);

  // Load reCAPTCHA script on mount
  useEffect(() => {
    if (isClient && !recaptchaLoaded.current) {
      const scriptId = "recaptcha-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.onload = () => {
          recaptchaLoaded.current = true;
        };
        document.body.appendChild(script);
      } else {
        recaptchaLoaded.current = true;
      }
    }
  }, [isClient]);

  // Timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  // Initial setup effect
  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      setUsername(storedPhoneNumber);
    }
  }, []);

  // Resend OTP handler
  const handleResendOtp = async () => {
    setOtp("");
    setotpFailed(false);
    setTimer(53); // Reset timer
    setIsResendDisabled(true); // Disable resend button again
    await handleGenerateOTP(); // Call the function to generate OTP
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const loginData = await loginWithOtp(username, otp.slice(0, 4)) as any;
      
      // Save token first so we can use it for the profile API call
      localStorage.setItem("token", loginData.AccessToken);
      
      // Fetch complete user profile data
      let completeUserData = { ...loginData };
      try {
        const profileData = await getUserProfile();
        // Merge login data with profile data
        completeUserData = {
          ...loginData,
          emailId: profileData.emailId,
          dob: profileData.dob,
          gender: profileData.gender
        };
      } catch (profileError) {
        console.warn("Could not fetch complete profile data:", profileError);
        // Continue with basic login data if profile fetch fails
      }
      
      // Save complete user data to localStorage
      localStorage.setItem("userData", JSON.stringify(completeUserData));
      
      setMessage("Login successful!");
      console.log("Login successful:", message);
      setotpFailed(false);
      toast.success('Login successful');
      
      // Get the intended destination from localStorage
      const intendedDestination = localStorage.getItem('intendedDestination') || '/';
      localStorage.removeItem('intendedDestination'); // Clean up
      
      // Ensure we're using the complete URL with query parameters
      const destinationUrl = intendedDestination.startsWith('/') 
        ? intendedDestination 
        : `/${intendedDestination}`;
      
      // Clear browser history and prevent back navigation
      window.history.pushState(null, '', destinationUrl);
      window.history.pushState(null, '', destinationUrl);
      window.onpopstate = function() {
        window.history.pushState(null, '', destinationUrl);
        router.push(destinationUrl);
      };
      
      // Force navigation to intended destination
      router.replace(destinationUrl);
    } catch (err) {
      setotpFailed(true);
      toast.error(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value.slice(0, 4));
  };

  const handleSlotClick = (index: number) => {
    const input = document.querySelector(`[data-slot="input-otp-slot"][data-index="${index}"]`) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  };

  const handleGenerateOTP = async () => {
    try {
      let recaptchaToken = "";
      if (isClient && (window as any).grecaptcha) {
        recaptchaToken = await (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "otp" });
      }
      const data = await generateOTP(username, recaptchaToken);
      toast.success('OTP Sent Successfully');
      console.log("OTP Sent", data);
    } catch (err) {
      setMessage(String(err));
      toast.error(String(err));
    }
  };

  return (
    <div className="px-2 md:px-0">
      <div className="text-[#4f6a85] login-title font-medium text-center mt-2 text-[20px] md:text-[24px] font-['Minion_Pro']">
        Welcome to HobyHub!
      </div>
      <div className="h-auto md:h-[27px] text-[12px] md:text-[14px] relative text-center mt-1 text-[#9c9e9e] trajan-pro font-bold">Start getting discovered locally and globally.</div>
      <form onSubmit={handleLogin}>
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-2 justify-center mt-[15px]">
          {/* Login Card */}

          <Card className="w-[95%] md:w-auto px-[12px] md:px-[18px] py-[15px] md:py-[17px] gap-0 rounded-none shadow-sm bg-white md:max-w-[569px] sm:max-w-[350px]">

            <h2 className="text-black text-lg font-bold trajan-pro">Login</h2>
            <div className="bg-[#fefefe] rounded-[7px] border-[2px] md:border-[3px] border-[#dddfe3] px-[10px] md:px-[14px] py-[14px] md:py-[18px] mt-[20px] md:mt-[23px]">
              {/* Phone Input */}
              <label className="text-[#9d9d9d] text-[12px] md:text-[12.80px] font-bold trajan-pro">Enter OTP</label>
              <div className="flex flex-row mt-1 gap-2 md:gap-4">
                <InputOTP 
                  maxLength={4} 
                  value={otp} 
                  onChange={handleOtpChange} 
                  required
                  autoFocus
                >
                  <InputOTPGroup className="flex flex-wrap gap-2 md:gap-4">
                    <InputOTPSlot
                      className="text-black text-2xl font-bold font-['Trajan_Pro'] items-center border border-gray-300 rounded-md outline-none flex-1 w-28 h-15 cursor-pointer"
                      index={0}
                      onClick={() => handleSlotClick(0)}
                    />
                    <InputOTPSlot
                      className="text-black text-2xl font-bold font-['Trajan_Pro'] items-center border border-gray-300 rounded-md outline-none flex-1 w-28 h-15 cursor-pointer"
                      index={1}
                      onClick={() => handleSlotClick(1)}
                    />
                    <InputOTPSlot
                      className="text-black text-2xl font-bold font-['Trajan_Pro'] items-center border border-gray-300 rounded-md outline-none flex-1 w-28 h-15 cursor-pointer"
                      index={2}
                      onClick={() => handleSlotClick(2)}
                    />
                    <InputOTPSlot
                      className="text-black text-2xl font-bold font-['Trajan_Pro'] items-center border border-gray-300 rounded-md outline-none flex-1 w-28 h-15 cursor-pointer"
                      index={3}
                      onClick={() => handleSlotClick(3)}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {otpFailed && <p className="text-red-500 text-md text-center">Please Enter Valid OTP</p>}
              <div className="flex justify-between text-[#c9c9c9] text-xs md:text-sm trajan-pro mt-2">
                <div>
                  <span className="text-[#345175] text-[13px] md:text-[14.90px] font-bold">{timer > 0 ? `00:${timer.toString().padStart(2, "0")}` : "00:00"}</span>{" "}
                  <span className="hover:text-blue-200 hover:cursor-pointer" onClick={!isResendDisabled ? handleResendOtp : undefined}>Resend OTP</span>
                </div>
                
              </div>

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
                  images={["/images/mobile.png",
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
              <Checkbox id="terms"
                checked={policyChecked}
                className="mt-1 md:mt-0"
                onCheckedChange={(checked) => setPolicyChecked(checked === true)} />
              <label htmlFor="terms" className="text-[#c6c7c7] text-[10px] md:text-xs trajan-pro font-bold">
                By proceeding, you agree to our
                Terms & Conditions and
                Privacy Policy
              </label>
            </div> */}

            {/* Button */}
            <div className="flex justify-center md:justify-start mt-2">
              <Button 
                className={`mt-4 ${isLoading ? 'w-full md:w-[30%]' : 'w-full md:w-[20%]'} app-bg-color text-white text-sm rounded-lg border border-[#90a2b7] trajan-pro cursor-pointer`}
                disabled={!isOtpComplete || isLoading}
              >
                {isLoading ? (
                  <>
                    Verifying...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Login"
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
                    "/images/mobile-encryption.jpg"                  ]}
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