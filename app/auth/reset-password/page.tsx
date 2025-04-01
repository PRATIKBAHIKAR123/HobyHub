"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { resetPassowrd } from "@/services/authService";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setnewPassword] = useState("");
  const [confirmpassword, setnewConfirmPassword] = useState("");
  const [isSubmitted, setisSubmitted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isPasswordValid = oldpassword.length >= 6 && newpassword.length >= 8;
  const isPasswordMatch = confirmpassword === newpassword;

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    setisSubmitted(true);
    e.preventDefault();
    if (isPasswordMatch) {
      try {
        await resetPassowrd(newpassword, oldpassword);
        toast.success('Password Reset successful');
        router.push("/auth/login");
      } catch (err) {
        toast.error(String(err));
      }
      setisSubmitted(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="">
      <div className="text-[#4f6a85] login-title font-medium text-center mt-2 text-[24px] font-['Minion_Pro']">
        Welcome to HobyHub!
      </div>
      <div className=" h-[27px] text-[14px] relative text-center mt-1 text-[#9c9e9e] trajan-pro font-bold">Start getting discovered locally and globally.</div>
      <form onSubmit={handleResetPassword}>
      <div className="container mx-auto flex flex-col md:flex-row items-start gap-2 justify-center mt-[16px]">
        {/* Login Card */}

        <Card className="px-[18px] py-[12px] gap-0 rounded-none shadow-sm bg-white w-[369px] md:w-[569px]">
          <h2 className="text-black text-lg font-bold trajan-pro mt-[8px]">Reset Password</h2>
          <div className="bg-[#fefefe] rounded-[7px] border-[3px] border-[#dddfe3] px-[14px] py-[18px] mt-[20px]">
            {/* Phone Input */}
            <div>
            <label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Old Password</label>
            <div className="flex items-center">
              
              <Input
                type="password"
                placeholder="Enter Password"
                value={oldpassword}
                onChange={(e) => setOldPassword(e.target.value)}
                maxLength={8}
                className="placeholder:text-[#e2e3e5] h-[48px] outline-none  flex-1 border border-gray-300 "
              />
              
            </div>
            </div>
            <div className="mt-2">
            <label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">New Password</label>
            <div className="flex items-center">
              
              <Input
                type="password"
                placeholder="Enter Password"
                value={newpassword}
                onChange={(e) => setnewPassword(e.target.value)}
                maxLength={8}
                className="placeholder:text-[#e2e3e5] h-[48px] outline-none  flex-1 border border-gray-300 "
              />
              
            </div>
            </div>
            <div className="mt-2">
            <label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Confirm Password</label>
            <div className="flex items-center">
              
              <Input
                type="password"
                placeholder="Enter Password"
                value={confirmpassword}
                onChange={(e) => setnewConfirmPassword(e.target.value)}
                maxLength={8}
                className="placeholder:text-[#e2e3e5] h-[48px] outline-none  flex-1 border border-gray-300 "
              />
              
            </div>
            </div>
            {(!isPasswordMatch&&isSubmitted)&&<p className="text-red-500 text-md">Password did not matched</p>}
            <p className="text-[#c9c9c9] text-[12.5px] trajan-pro mt-2">
              Reset a New Password
            </p>

            {/* Features */}
            {/* <ul className="text-[#b6b6b7] text-[11.5px] trajan-pro mt-3 space-y-1">
              <li>✔ Get discovered by local & international learners easily</li>
              <li>✔ Showcase your workshops & skills</li>
              <li>✔ Connect with passionate hobbyists</li>
            </ul> */}
          </div>

          {/* <Card className="md:hidden my-3 sm:block md:w-[566px] sm:w-[350px] h-[273px]">
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
          </Card> */}
          {/* Checkbox & Policy */}
          {/* <div className="flex items-center gap-2 mt-[15px]">
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
          </div> */}
          {/* <span className="text-[#9d9d9d] text-[10.80px] py-2 font-bold trajan-pro">Dont have an account? <a className="hover:cursor-pointer text-[#3e606e]" onClick={() => router.push("sign-up")}>Sign Up!</a></span> */}
          {/* Button */}
          <Button className={` sm:w-full md:w-[30%] mt-2 app-bg-color text-sm rounded-lg border border-[#90a2b7] trajan-pro cursor-pointer ${isPasswordValid ? " text-white" : " text-[#d4dde8]"
            }`} disabled={!isPasswordValid}>
            Reset Password
          </Button>
        </Card>

        {/* Illustration */}
        {/* <Card className=" px-[18px] py-[13px] rounded-none shadow-sm hidden md:block md:w-[585px] sm:w-[350px] max-h-[340px]">
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
        </Card> */}
      </div>
      </form>
    </div>


  );

}