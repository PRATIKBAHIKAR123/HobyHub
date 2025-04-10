import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { useWatch } from "react-hook-form";

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

import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface CostRangeInputProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}

export default function CostRangeInput({ register, control, setValue, errors }: CostRangeInputProps) {
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
          To
          <Input
            placeholder="e.g. 2000"
            {...register("tocost")}
            className="h-[52px] border-[#05244f]"
          />
        </div>
        {errors.fromcost && <p className="text-red-500 text-sm">{String(errors.fromcost.message)}</p>}
        {errors.tocost && <p className="text-red-500 text-sm">{String(errors.tocost.message)}</p>}
      </div>
    );
  }