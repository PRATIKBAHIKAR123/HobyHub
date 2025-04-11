import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { useWatch } from "react-hook-form";
import { FormInputProps } from "./types";

export const ageRangeSchema = {
  fromage: yup.string().required("From age is required"),
  toage: yup.string()
    .required("To age is required")
    .test(
      'is-greater-than-fromage',
      'To age must be greater than or equal to From age',
      function(value) {
        const { fromage } = this.parent;
        if (!fromage || !value) return true;
        return Number(value) >= Number(fromage);
      }
    ),
  age: yup.string(),
};

export default function AgeRangeInput({ form, setValue, errors }: FormInputProps) {
  const { register, control } = form;
  
  // Watch fromage and toage
  const fromage = useWatch({
    control,
    name: "fromage",
  });
  
  const toage = useWatch({
    control,
    name: "toage",
  });
  
  // Update age whenever fromage or toage changes
  useEffect(() => {
    if (fromage && toage) {
      setValue("age", `${fromage} - ${toage}`);
    }
  }, [fromage, toage, setValue]);
  
  return (
    <div className="flex flex-col gap-2">
      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Age Range</Label>
      <div className="flex justify-between gap-2 items-center">
        <Input
          placeholder="e.g. 15"
          {...register("fromage")}
          className="h-[52px] border-[#05244f]"
        />
        <span className="text-gray-500">to</span>
        <Input
          placeholder="e.g. 25"
          {...register("toage")}
          className="h-[52px] border-[#05244f]"
        />
      </div>
      {errors.fromage && (
        <p className="text-red-500 text-xs">{errors.fromage.message}</p>
      )}
      {errors.toage && (
        <p className="text-red-500 text-xs">{errors.toage.message}</p>
      )}
    </div>
  );
}