import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { useWatch } from "react-hook-form";
import { FormInputProps } from "./types";

export const costRangeSchema = {
    sessionFrom: yup.string(),
    sessionTo: yup.string()
      .test(
        'is-greater-than-sessionFrom',
        'To Session must be greater than or equal to From Session',
        function(value) {
          const { sessionFrom } = this.parent;
          if (!sessionFrom || !value) return true;
          return Number(value) >= Number(sessionFrom);
        }
      ),
    cost: yup.string(),
  };

export default function SessionRangeInput({ form, setValue, errors }: FormInputProps) {
    const { register, control } = form;
    
    // Watch sessionFrom and sessionTo
    const sessionFrom = useWatch({
      control,
      name: "sessionFrom",
    });
    
    const sessionTo = useWatch({
      control,
      name: "sessionTo",
    });
    
    // Update cost whenever sessionFrom or sessionTo changes
    useEffect(() => {
      if (sessionFrom && sessionTo) {
        setValue("noOfSessions", `${sessionFrom} - ${sessionTo}`);
      }
    }, [sessionFrom, sessionTo, setValue]);
    
    return (
      <div className="flex flex-col gap-2">
        <Label className="w-[177px] text-black text-[11.6px] font-semibold">Session Range</Label>
        <div className="flex justify-between gap-2 items-center">
          <Input
          type="number"
          min={0}
            placeholder="e.g. 2"
            {...register("sessionFrom")}
            className="h-[52px] border-[#05244f]"
          />
          <span className="text-gray-500">to</span>
          <Input
          type="number"
          min={1}
            placeholder="e.g. 5"
            {...register("sessionTo")}
            className="h-[52px] border-[#05244f]"
          />
        </div>
        {errors.sessionFrom && (
          <p className="text-red-500 text-xs">{errors.sessionFrom.message}</p>
        )}
        {errors.sessionTo && (
          <p className="text-red-500 text-xs">{errors.sessionTo.message}</p>
        )}
      </div>
    );
  }