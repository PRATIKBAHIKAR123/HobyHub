"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { generateOTP } from "@/services/authService";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [policyChecked, setPolicyChecked] = useState(false);

  // Validate phone number length
  const isPhoneValid = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);

    const [message, setMessage] = useState("");
  
      const handleGenerateOTP = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const data = await generateOTP(phoneNumber);
          localStorage.setItem("phoneNumber", phoneNumber);
          toast.success('OTP Generate successful');
          setMessage("OTP Generate successful!");
          router.push("/auth/otp");
          console.log("Login successful:", message);
        } catch (err) {
          setMessage(String(err));
          toast.error(String(err));
        }
      };
  return (
    <div className="">
      <div className="text-[#4f6a85] login-title font-medium text-center mt-2 text-[24px] font-['Minion_Pro']">
        Welcome to HobyHub!
      </div>
      <div className=" h-[27px] text-[14px] relative text-center mt-1 text-[#9c9e9e] trajan-pro font-bold">Start getting discovered locally and globally.</div>
      <form onSubmit={handleGenerateOTP}>
      <div className="container mx-auto flex flex-col md:flex-row items-start gap-2 justify-center mt-[16px]">
        {/* Login Card */}

        <Card className="px-[18px] py-[12px] gap-0 rounded-none shadow-sm bg-white md:max-w-[569px] sm:max-w-[369px]">
          <h2 className="text-black text-lg font-bold trajan-pro mt-[8px]">Login</h2>
          <div className="bg-[#fefefe] rounded-[7px] border-[3px] border-[#dddfe3] px-[14px] py-[18px] mt-[20px]">
            {/* Phone Input */}
            <label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Phone Number</label>
            <div className="flex items-center">
              <Select>
                <SelectTrigger className="w-[20%] h-[48px] rounded-l-md rounded-r-none border-gray-300 border-r-0">
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
                className="placeholder:text-[#e2e3e5] h-[48px] outline-none  rounded-l-md rounded-l-none flex-1 border border-gray-300  border-l-0"
              />
            </div>

            <p className="text-[#c9c9c9] text-[12.5px] trajan-pro mt-2">
              We ll send you an OTP via WhatsApp and SMS to verify your account.
            </p>

            {/* Features */}
            <ul className="text-[#b6b6b7] text-[11.5px] trajan-pro mt-3 space-y-1">
              <li>✔ Get discovered by local & international learners easily</li>
              <li>✔ Showcase your workshops & skills</li>
              <li>✔ Connect with passionate hobbyists</li>
            </ul>
          </div>

          <Card className="md:hidden my-3 sm:block md:w-[566px] sm:w-[350px] h-[273px]">
            <CardContent>
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="flex justify-center">
                        <Image
                          src="/images/mobile.png"
                          alt="Illustration"
                          width={300}
                          height={260}
                          className="w-[300px] h-[238px]"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all ${currentIndex === index ? "bg-[#3E606C]" : "bg-[#E4E4E4]"
                      }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>

            </CardContent>
          </Card>
          {/* Checkbox & Policy */}
          <div className="flex items-center gap-2 mt-[15px]">
            <Checkbox
              id="terms"
              checked={policyChecked}
              onCheckedChange={(checked) => setPolicyChecked(checked === true)}
            />
            <label htmlFor="terms" className="text-[#c6c7c7] text-xs trajan-pro font-bold">
              By proceeding, you agree to our
              Terms & Conditions and
              Privacy Policy
            </label>
          </div>
          <span className="text-[#9d9d9d] text-[10.80px] py-2 font-bold trajan-pro">Dont have an account? <a className="hover:cursor-pointer text-[#3e606e]" onClick={() => router.push("sign-up")}>Sign Up!</a></span>
          {/* Button */}
          <Button className={` sm:w-full md:w-[20%] app-bg-color text-sm rounded-lg border border-[#90a2b7] trajan-pro cursor-pointer ${isPhoneValid && policyChecked ? " text-white" : " text-[#d4dde8]"
            }`} disabled={!isPhoneValid||!policyChecked}>
            Send OTP
          </Button>
        </Card>

        {/* Illustration */}
        <Card className=" px-[18px] py-[13px] rounded-none shadow-sm hidden md:block md:w-[585px] sm:w-[350px] max-h-[340px]">
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="flex justify-center">
                      <Image
                        src="/images/mobile.png"
                        alt="Illustration"
                        width={445}
                        height={445}
                        className="w-[418px] max-h-[320px]"
                      />
                    </div>

                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex justify-center mt-[24px] space-x-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? "bg-[#3E606C]" : "bg-[#E4E4E4]"
                    }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </form>
    </div>


  );

}