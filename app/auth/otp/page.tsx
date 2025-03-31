"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, } from "@/components/ui/carousel";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { loginWithOtp } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const data = await loginWithOtp(username, otp) as { token: string };
        localStorage.setItem("token", data.token); // Save token
        setMessage("Login successful!");
      } catch (err: any) {
        setMessage(err);
      }
    };
    
  return (
    <div className="">
      <div className="text-[#4f6a85] login-title font-medium text-center mt-2 text-[24px] font-['Minion_Pro']">
        Welcome to HobyHub!
      </div>
      <div className=" h-[27px] text-[14px] relative text-center mt-1 text-[#9c9e9e] trajan-pro font-bold">Start getting discovered locally and globally.</div>
      <div className="container mx-auto flex flex-col md:flex-row sm:col items-center gap-2 justify-center mt-[15px]">
        {/* Login Card */}

        <Card className="px-[18px] py-[17px] gap-0 rounded-none shadow-sm bg-white md:max-w-[569px] sm:max-w-[369px]">
        <form onSubmit={handleLogin}>
          <h2 className="text-black text-lg font-bold trajan-pro">Login</h2>
          <div className="bg-[#fefefe] rounded-[7px] border-[3px] border-[#dddfe3] px-[14px] py-[18px] mt-[23px]">
            {/* Phone Input */}
            <label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Enter OTP</label>
            <div className="flex flex-row flex-wrap  mt-1 gap-4">
              {/* <span className="text-gray-600  px-3">+91</span> */}
              {/* <Input
                type="number"
                max={1}
                placeholder=""
                className="items-center border border-gray-300 rounded-md outline-none flex-1 w-15 h-15"
              />
              <Input
                type="text"
                placeholder=""
                className="items-center border border-gray-300 rounded-md outline-none flex-1 w-15 h-15"
              />
              <Input
                type="text"
                placeholder=""
                className="items-center border border-gray-300 rounded-md outline-none flex-1 w-15 h-15"
              />
              <Input
                type="text"
                placeholder=""
                className="items-center border border-gray-300 rounded-md outline-none flex-1 w-15 h-15"
              /> */}

              <InputOTP maxLength={6}>
                <InputOTPGroup className="flex flex-wrap  gap-2 md:gap-4">
                  <InputOTPSlot className=" text-black text-2xl font-bold font-['Trajan_Pro'] items-center border border-gray-300 rounded-md outline-none flex-1 w-28 h-15" index={0} />
                  <InputOTPSlot className=" text-black text-2xl font-bold font-['Trajan_Pro'] items-center border border-gray-300 rounded-md outline-none flex-1 w-28 h-15" index={1} />
                  <InputOTPSlot className=" text-black text-2xl font-bold font-['Trajan_Pro'] items-center border border-gray-300 rounded-md outline-none flex-1 w-28 h-15" index={2} />
                  <InputOTPSlot className=" text-black text-2xl font-bold font-['Trajan_Pro'] items-center border border-gray-300 rounded-md outline-none flex-1 w-28 h-15" index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <p className="text-[#c9c9c9] text-sm trajan-pro mt-2">
              <span className="text-[#345175] text-[14.90px] font-bold">00:53</span> <span className="hover:text-blue-200 hover:cursor-pointer">Resend OTP</span>
            </p>



            {/* Features */}
            <ul className="text-[#b6b6b7] text-sm trajan-pro mt-3 space-y-1">
              <li>✔ Get discovered by local & international learners easily</li>
              <li>✔ Showcase your workshops & skills</li>
              <li>✔ Connect with passionate hobbyists</li>
            </ul>
          </div>
  </form>
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
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-[#c6c7c7] text-xs trajan-pro font-bold">
              By proceeding, you agree to our
              Terms & Conditions and
              Privacy Policy
            </label>
          </div>

          {/* Button */}
          <Button className="mt-4  sm:w-full md:w-[20%] app-bg-color text-white text-sm rounded-lg border border-[#90a2b7] trajan-pro" onClick={() => router.push("/")}>
            Login
          </Button>
        </Card>

        {/* Illustration */}
        <Card className="rounded-none shadow-sm hidden md:block md:w-[585px] sm:w-[350px] max-h-[380px]">
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
                        className="w-[418px] max-h-[340px]"
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
    </div>
  );
}