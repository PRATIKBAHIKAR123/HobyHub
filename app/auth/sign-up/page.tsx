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
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datepicker";
import { registerCustomer } from "@/services/authService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  emailId: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  dob: yup.string().required("Date Of Birth is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>();

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        gender: "Male",  // Setting default gender
      },
    });
  
    interface FormData {
      name: string;
      emailId: string;
      phoneNumber: string;
      gender: string;
      dob: string;
      password?: string;
    }

    const onSubmit = async (formData: FormData) => {
      formData.password = "123456"; // Default password
    
      try {
      const data = await registerCustomer(formData);
      
      if (data.status === 200) {
        toast.success("Registration successful!");
        router.push("/auth/login");
      } else {
        toast.error(String(data.data));
      }
      
      } catch (err) {
      console.log("err:", String(err));
      }
    };

  // Validate phone number length
  //const isPhoneValid = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);
  return (
    <div className="">
      <div className="text-[#4f6a85] login-title font-medium text-center mt-2 text-[24px] font-['Minion_Pro']">
        Welcome to HobyHub!
      </div>
      <div className=" h-[27px] text-[14px] relative text-center mt-1 text-[#9c9e9e] trajan-pro font-bold">Start getting discovered locally and globally.</div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container mx-auto flex flex-col md:flex-row items-start gap-2 justify-center mt-[16px]">
        {/* Login Card */}

        <Card className="px-[18px] py-[12px] gap-0 rounded-none shadow-sm bg-white md:max-w-[569px] sm:max-w-[369px]">
          <h2 className="text-black text-lg font-bold trajan-pro mt-[8px]">Sign Up</h2>
          <div className="bg-[#fefefe] rounded-[7px] border-[3px] border-[#dddfe3] px-[14px] py-[18px] mt-[20px]">
            {/* Phone Input */}
            <div className="flex-col flex gap-2 justify-between">
              <div>
                <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Name</Label>

                <Input
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                  className="placeholder:text-[#e2e3e5] h-[48px] outline-none  rounded-l-md flex-1 border border-gray-300"
                />
                <p className="text-red-500 text-md">{errors.name?.message}</p>
              </div>
              <div>
                <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">E-Mail</Label>
                <Input
                  type="text"
                  placeholder="Enter your E-mail"
                  {...register("emailId")}
                  className="placeholder:text-[#e2e3e5] h-[48px] outline-none  rounded-l-md flex-1 border border-gray-300"
                />
                <p className="text-red-500 text-md">{errors.emailId?.message}</p>
              </div>
              <div>
                <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Contact</Label>
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
                    placeholder="Enter your Contact"
                    {...register("phoneNumber")}
                    maxLength={10}
                    className="placeholder:text-[#e2e3e5] h-[48px] outline-none  rounded-l-md rounded-l-none flex-1 border border-gray-300  border-l-0"
                  />
                  
                </div>
                <p className="text-red-500 text-md">{errors.phoneNumber?.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Date Of Birth</Label>
                {/* <Input
                type="text"
                placeholder="Enter your Date Of Birth"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="placeholder:text-[#e2e3e5] h-[48px] outline-none  rounded-l-md flex-1 border border-gray-300"
              /> */}
                <DatePicker value={selectedDate}   onChange={(date) => {
    setSelectedDate(date);
    if (date) {
      setValue("dob", date.toString(), { shouldValidate: true }); // ✅ Update form value
    }
  }} placeholder="Date Of Birth" className="w-full placeholder:text-[#e2e3e5] h-[48px] outline-none  rounded-l-md flex-1 border border-gray-300" />
                <p className="text-red-500 text-md">{errors.dob?.message}</p>
              </div>
              <div>
                <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Select Gender</Label>
                <Select {...register("gender")}>
                  <SelectTrigger className="w-full placeholder:text-[#e2e3e5] h-[48px] outline-none  rounded-l-md flex-1 border border-gray-300">
                    <SelectValue placeholder="Male" />
                  </SelectTrigger>
                  <SelectContent>

                    <SelectItem value="Male">
                      Male
                    </SelectItem>
                    <SelectItem value="Female">
                      Female
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-red-500 text-md">{errors.gender?.message}</p>
              </div>
              </div>
            </div>
            {/* <p className="text-[#c9c9c9] text-[12.5px] trajan-pro mt-2">
              We ll send you an OTP via WhatsApp and SMS to verify your account.
            </p> */}

            {/* <ul className="text-[#b6b6b7] text-[11.5px] trajan-pro mt-3 space-y-1">
              <li>✔ Get discovered by local & international learners easily</li>
              <li>✔ Showcase your workshops & skills</li>
              <li>✔ Connect with passionate hobbyists</li>
            </ul> */}
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
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-[#c6c7c7] text-xs trajan-pro font-bold">
              By proceeding, you agree to our
              Terms & Conditions and
              Privacy Policy
            </label>
          </div>
          <span className="text-[#9d9d9d] text-[10.80px] py-2 font-bold trajan-pro">Already have an account? <a className="hover:cursor-pointer text-[#3e606e]" onClick={() => router.push("login")}>Sign In</a></span>
          {/* Button */}
          <Button className={` sm:w-full md:w-[30%] app-bg-color text-sm rounded-lg border border-[#90a2b7] trajan-pro color-[#fff]" 
            }`} >
            Create Account
          </Button>
        </Card>

        {/* Illustration */}
        <Card className=" px-[18px] py-[13px] rounded-none shadow-sm hidden md:block md:w-[585px] sm:w-[350px] ">
          <CardContent className="relative">
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
                        className="w-[418px] h-[455px] max-h-[540px]"
                      />
                    </div>

                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex justify-center mt-[24px] space-x-1 absolute w-full">
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



