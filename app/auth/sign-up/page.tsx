"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { registerCustomer } from "@/services/authService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TermsAndPrivacyContent } from "@/components/TermsAndPrivacyContent";
import { ImageCarousel } from "@/components/ImageCarousel";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  emailId: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  gender: yup.string(),
  dob: yup.string(),
  countryCode: yup.string(),
});

export default function LoginPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsModalType, setTermsModal] = useState<"privacy" | "terms">('privacy');
  const [countryCode, setCountryCode] = useState('91'); // Default to India

  // Add verification status states
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      countryCode: '91', // Set default country code
    },
  });

  // Watch all form fields
  const formValues = watch();

  // Check if all required fields are filled
  const isFormValid = formValues.name &&
    formValues.emailId &&
    formValues.phoneNumber &&
    isTermsChecked;

  interface FormData {
    name: string;
    emailId: string;
    phoneNumber: string;
    countryCode: string;
    gender?: string;
    dob?: string;
    password?: string;
  }

  // Function to verify email
  const verifyEmail = async () => {
    if (!formValues.emailId || errors.emailId) return;

    // Simulate verification process
    setIsLoading(true);
    setTimeout(() => {
      setIsEmailVerified(true);
      setIsLoading(false);
      toast.success("Email verification OTP sent successfully!");
    }, 1000);

    // In real implementation, you would call an API to send verification OTP
    // Example: await sendEmailVerificationOTP(formValues.emailId);
  };

  // Function to verify phone
  const verifyPhone = async () => {
    if (!formValues.phoneNumber || errors.phoneNumber) return;

    // Simulate verification process
    setIsLoading(true);
    setTimeout(() => {
      setIsPhoneVerified(true);
      setIsLoading(false);
      toast.success("Phone verification OTP sent successfully!");
    }, 1000);

    // In real implementation, you would call an API to send verification OTP
    // Example: await sendPhoneVerificationOTP(formValues.phoneNumber);
  };

  const onSubmit = async (formData: any) => {
    const submitData: FormData = {
      ...formData,
      password: "123456", // Default password
      countryCode: countryCode, // Add country code to payload
    };
    setIsLoading(true);

    try {
      const data = await registerCustomer(submitData);

      if (data.status === 200) {
        toast.success("Registration successful!");
        router.push("/auth/login");
      } else {
        toast.error(String(data.data));
      }

    } catch (err) {
      console.log("err:", String(err));
      toast.error(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle date change
  const handleDateChange = (date: Date | null): void => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setValue("dob", formattedDate, { shouldValidate: true });
    }
  };

  const carouselImages = [
    "/images/mobile.png",
    "/images/computer-security-with-login-password-padlock%201.png",
    "/images/verification-code.jpg",
    "/images/mobile-encryption.jpg"
  ];

  return (
    <div className="">
      <div className="text-[#4f6a85] login-title font-medium text-center mt-2 text-[24px] font-['Minion_Pro']">
        Welcome to HobyHub!
      </div>
      <div className="h-[27px] text-[14px] relative text-center mt-1 text-[#9c9e9e] trajan-pro font-bold">Start getting discovered locally and globally.</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container mx-auto flex flex-col md:flex-row items-start gap-2 justify-center mt-[16px]">
          {/* Login Card */}
          <Card className="px-[18px] py-[12px] gap-0 rounded-none shadow-sm bg-white md:max-w-[569px] sm:max-w-[369px]">
            <h2 className="text-black text-lg font-bold trajan-pro mt-[8px]">Sign Up</h2>
            <p className="text-red-500 text-sm mt-1">* Required Fields</p>
            <div className="bg-[#fefefe] rounded-[7px] border-[3px] border-[#dddfe3] px-[14px] py-[18px] mt-[20px]">
              {/* Phone Input */}
              <div className="flex-col flex gap-2 justify-between">
                <div>
                  <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Name <span className="text-red-500">*</span></Label>

                  <Input
                    type="text"
                    placeholder="Enter Your Full Name"
                    {...register("name")}
                    className="placeholder:text-[#e2e3e5] h-[48px] outline-none rounded-l-md flex-1 border border-gray-300"
                    autoFocus
                  />
                  <p className="text-red-500 text-md">{errors.name?.message}</p>
                </div>

                {/* Email with verification icon */}
                <div>
                  <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">E-Mail <span className="text-red-500">*</span></Label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder="Enter Your Email"
                        {...register("emailId")}
                        className="placeholder:text-[#e2e3e5] h-[48px] outline-none rounded-l-md flex-1 border border-gray-300 pr-10"
                      />
                      {formValues.emailId && !errors.emailId && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isEmailVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {formValues.emailId && !errors.emailId && !isEmailVerified && (
                      <Button
                        type="button"
                        onClick={verifyEmail}
                        disabled={isLoading}
                        className="ml-2 h-[48px] bg-[#3e606e] hover:bg-[#2d4752] text-white"
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                  <p className="text-red-500 text-md">{errors.emailId?.message}</p>
                  {isEmailVerified && (
                    <p className="text-green-500 text-xs mt-1">Email verified successfully!</p>
                  )}
                </div>

                {/* Phone with verification icon - Updated to use PhoneInput */}
                <div>
                  <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Contact <span className="text-red-500">*</span></Label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <PhoneInput
                        country={'in'}
                        value={watch("phoneNumber")}
                        onChange={(value, country) => {
                          setValue("phoneNumber", value);
                          if (country && typeof country === 'object' && 'dialCode' in country) {
                            setValue("countryCode", country.dialCode);
                            setCountryCode(country.dialCode);
                          }
                        }}
                        inputClass="!h-[48px] !pl-[60px] !w-full !border !border-gray-300 !rounded-md"
                        buttonClass="!border !border-gray-300 !rounded-l-md"
                        containerClass="!w-full !border !border-gray-300 !rounded-md"
                        inputProps={{
                          name: 'phoneNumber',
                          required: true,
                        }}
                      />
                      {formValues.phoneNumber && !errors.phoneNumber && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                          {isPhoneVerified ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {formValues.phoneNumber && !errors.phoneNumber && !isPhoneVerified && (
                      <Button
                        type="button"
                        onClick={verifyPhone}
                        disabled={isLoading}
                        className="ml-2 h-[48px] bg-[#3e606e] hover:bg-[#2d4752] text-white"
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                  <p className="text-red-500 text-md">{errors.phoneNumber?.message}</p>
                  {isPhoneVerified && (
                    <p className="text-green-500 text-xs mt-1">Phone number verified successfully!</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Date Of Birth</Label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => handleDateChange(date)}
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      placeholderText="Select your Date Of Birth"
                      className="w-full h-[48px] border border-gray-300 rounded-md px-3"
                      dateFormat="dd/MM/yyyy"
                    />
                    <p className="text-red-500 text-md">{errors.dob?.message}</p>
                  </div>
                  <div>
                    <Label className="text-[#9d9d9d] text-[12.80px] font-bold trajan-pro">Select Gender</Label>
                    <Select
                      onValueChange={(value) => setValue("gender", value, { shouldValidate: true })}
                    >
                      <SelectTrigger className="w-full placeholder:text-[#e2e3e5] h-[48px] outline-none rounded-md flex-1 border border-gray-300">
                        <SelectValue placeholder="Male" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">
                          Male
                        </SelectItem>
                        <SelectItem value="Female">
                          Female
                        </SelectItem>
                        <SelectItem value="Trans">
                          Trans
                        </SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-red-500 text-md">{errors.gender?.message}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Carousel */}
            <Card className="md:hidden my-3 sm:block md:w-[566px] sm:w-[350px]">
              <CardContent className="p-0">
                <ImageCarousel
                  images={carouselImages}
                  width={300}
                  height={260}
                  className="w-[300px] h-[238px]"
                />
              </CardContent>
            </Card>

            {/* Checkbox & Policy */}
            <div className="flex items-center gap-2 mt-[15px]">
              <Checkbox
                id="terms"
                checked={isTermsChecked}
                onCheckedChange={(checked) => setIsTermsChecked(checked as boolean)}
              />
              <label htmlFor="terms" className="text-[#c6c7c7] text-xs mt-2 trajan-pro font-bold">
                By proceeding, you agree to our{" "}
                <button
                  type="button"
                  onClick={() => {setShowTermsModal(true); setTermsModal('terms')}}
                  className="text-[#3e606e] hover:underline"
                >
                  Terms & Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => {setShowTermsModal(true); setTermsModal('privacy')}}
                  className="text-[#3e606e] hover:underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            <TermsAndPrivacyContent
              isOpen={showTermsModal}
              onClose={() => setShowTermsModal(false)} type={termsModalType}
            />
            <span className="text-[#9d9d9d] text-[10.80px] py-2 font-bold trajan-pro">Already have an account? <a className="hover:cursor-pointer text-[#3e606e]" onClick={() => router.push("login")}>Sign In</a></span>
            {/* Button */}
            <Button
              type="submit"
              className={`sm:w-full md:w-[30%] app-bg-color text-sm rounded-lg border border-[#90a2b7] trajan-pro color-[#fff]`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  Creating...
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </Card>

          {/* Desktop Carousel */}
          <Card className="px-[18px] py-[17px] rounded-none shadow-sm hidden md:block md:w-[585px] sm:w-[350px]">
            <CardContent className="p-0">
              <ImageCarousel
                images={carouselImages}
                width={445}
                height={340}
                className="w-[418px] h-[340px]"
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}



