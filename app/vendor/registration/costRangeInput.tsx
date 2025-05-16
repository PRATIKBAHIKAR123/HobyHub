import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface CostRangeInputProps {
  form: UseFormReturn<FormValues>;
  setValue: (name: keyof FormValues, value: any) => void;
  errors: any;
}

export default function CostRangeInput({ form, errors }: CostRangeInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Cost Range</Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="number"
            placeholder="From"
            {...form.register("fromcost")}
            className="h-[52px] border-[#05244f]"
          />
          {errors.fromcost && (
            <p className="text-red-500 text-xs">{errors.fromcost.message}</p>
          )}
        </div>
        <div className="flex-1">
          <Input
            type="number"
            placeholder="To"
            {...form.register("tocost")}
            className="h-[52px] border-[#05244f]"
          />
          {errors.tocost && (
            <p className="text-red-500 text-xs">{errors.tocost.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}