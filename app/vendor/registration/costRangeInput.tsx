import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { useWatch } from "react-hook-form";
import { FormInputProps } from "./types";

export const costRangeSchema = {
    fromcost: yup.string(),
    tocost: yup.string()
      .test(
        'is-greater-than-fromcost',
        'To cost must be greater than or equal to From cost',
        function(value) {
          const { fromcost } = this.parent;
          if (!fromcost || !value) return true;
          return Number(value) >= Number(fromcost);
        }
      ),
    cost: yup.string(),
  };

export default function CostRangeInput({ form, setValue, errors }: FormInputProps) {
    const { register, control } = form;
    
    // Watch fromcost and tocost
    const fromcost = useWatch({
      control,
      name: "fromcost",
    });
    
    const tocost = useWatch({
      control,
      name: "tocost",
    });
    
    // Update cost whenever fromcost or tocost changes
    useEffect(() => {
      if (fromcost && tocost) {
        setValue("cost", `${fromcost} - ${tocost}`);
      }
    }, [fromcost, tocost, setValue]);
    
    return (
      <div className="flex flex-col gap-2">
        <Label className="w-[177px] text-black text-[11.6px] font-semibold">Cost Range</Label>
        <div className="flex justify-between gap-2 items-center">
          <Input
            placeholder="e.g. 1000"
            {...register("fromcost")}
            className="h-[52px] border-[#05244f]"
          />
          <span className="text-gray-500">to</span>
          <Input
            placeholder="e.g. 2000"
            {...register("tocost")}
            className="h-[52px] border-[#05244f]"
          />
        </div>
        {errors.fromcost && (
          <p className="text-red-500 text-xs">{errors.fromcost.message}</p>
        )}
        {errors.tocost && (
          <p className="text-red-500 text-xs">{errors.tocost.message}</p>
        )}
      </div>
    );
  }