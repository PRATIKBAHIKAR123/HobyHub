import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useWatch } from "react-hook-form";
import { FormInputProps } from "./types";
import * as yup from "yup";

// Yup schema for validation
export const timeRangeScheme = {
  timingsFrom: yup.string(),
  timingsTo: yup.string()
    .test(
      'is-greater-than-timingsFrom',
      'To Time must be greater than or equal to From Time',
      function (value) {
        const { timingsFrom } = this.parent;
        if (!timingsFrom || !value) return true;
        return timingsFrom <= value;
      }
    ),
  time: yup.string().required('Time is required'),
};

export default function TimeRangeInput({ form, setValue, errors }: FormInputProps) {
  const { register, control } = form;
  const timingsFrom = useWatch({ control, name: "timingsFrom" });
  const timingsTo = useWatch({ control, name: "timingsTo" });

  const fromTimeRef = useRef<HTMLInputElement | null>(null);
  const toTimeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (timingsFrom && timingsTo) {
      const formatted = `${timingsFrom} - ${timingsTo}`;
      setValue("time", formatted);
    }
  }, [timingsFrom, timingsTo, setValue]);

  const handleTimeInputClick = (inputRef: React.RefObject<HTMLInputElement | null>) => {
      if (inputRef.current?.showPicker) {
        inputRef.current.showPicker();
      } else {
        inputRef.current?.focus(); // fallback
      }
    };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-start gap-2 items-center">
        <Input
          id="timingsFrom"
          type="time"
          {...register("timingsFrom")}
          ref={(el) => {
            fromTimeRef.current = el;
            register("timingsFrom").ref(el);
          }}
          onClick={() => handleTimeInputClick(fromTimeRef)}
          className="h-[52px] border-[#05244f] w-auto"
        />
        <span className="text-gray-500">to</span>
        <Input
          id="timingsTo"
          type="time"
          {...register("timingsTo")}
          ref={(el) => {
            toTimeRef.current = el;
            register("timingsTo").ref(el);
          }}
          onClick={() => handleTimeInputClick(toTimeRef)}
          className="h-[52px] border-[#05244f] w-auto"
        />
      </div>

      {errors.timingsFrom && (
        <p className="text-red-500 text-xs">{errors.timingsFrom.message}</p>
      )}
      {errors.timingsTo && (
        <p className="text-red-500 text-xs">{errors.timingsTo.message}</p>
      )}
    </div>
  );
}
// const formatTo12Hour = (time: string): string => {
//   if (!time) return "";
//   const [hourStr, minuteStr] = time.split(":");
//   let hour = parseInt(hourStr, 10);
//   const minute = minuteStr;
//   const ampm = hour >= 12 ? "PM" : "AM";
//   hour = hour % 12 || 12; // Convert 0 to 12
//   return `${hour}:${minute} ${ampm}`;
// };

