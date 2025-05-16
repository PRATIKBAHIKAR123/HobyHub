import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface AgeRangeInputProps {
  form: UseFormReturn<FormValues>;
  setValue: (name: keyof FormValues, value: any) => void;
  errors: any;
}

export default function AgeRangeInput({ form, errors }: AgeRangeInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Age Range</Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="From"
            {...form.register("fromage")}
            className="h-[52px] border-[#05244f]"
          />
          {errors.fromage && (
            <p className="text-red-500 text-xs">{errors.fromage.message}</p>
          )}
        </div>
        <div className="flex-1">
          <Input
            type="number"
            placeholder="To"
            {...form.register("toage")}
            className="h-[52px] border-[#05244f]"
          />
          {errors.toage && (
            <p className="text-red-500 text-xs">{errors.toage.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}