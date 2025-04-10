import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { useWatch } from "react-hook-form";

export const ageRangeSchema = {
    fromage: yup.string().required("From cost is required"),
    toage: yup.string()
      .required("To cost is required")
      .test(
        'is-greater-than-fromage',
        'To cost must be greater than or equal to From cost',
        function(value) {
          const { fromage } = this.parent;
          if (!fromage || !value) return true;
          return Number(value) >= Number(fromage);
        }
      ),
    age: yup.string(),
  };

import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

interface CostRangeInputProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}

export default function AgeRangeInput({ register, control, setValue, errors }: CostRangeInputProps) {
    // Watch fromage and toage
    const fromage = useWatch({
      control,
      name: "fromage",
    });
    
    const toage = useWatch({
      control,
      name: "toage",
    });
    
    // Update cost whenever fromage or toage changes
    useEffect(() => {
      if (fromage && toage) {
        setValue("age", `${fromage} - ${toage}`);
      }
    }, [fromage, toage, setValue]);
    
    return (
      <div className="flex flex-col gap-2">
        <Label className="w-[177px] text-black text-[11.6px] font-semibold">Age</Label>
        <div className="flex justify-between gap-2 items-center">
          <Input
            placeholder="e.g. 15"
            {...register("fromage")}
            className="h-[52px] border-[#05244f]"
          />
          To
          <Input
            placeholder="e.g. 20"
            {...register("toage")}
            className="h-[52px] border-[#05244f]"
          />
        </div>
        {errors.fromage && <p className="text-red-500 text-sm">{String(errors.fromage.message)}</p>}
        {errors.toage && <p className="text-red-500 text-sm">{String(errors.toage.message)}</p>}
      </div>
    );
  }