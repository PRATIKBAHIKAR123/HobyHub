import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useWatch } from "react-hook-form";
import { FormInputProps } from "./types";
import * as yup from "yup";

// Yup schema for validation
export const timeRangeScheme = {
  timingsFrom: yup.string()
    .required('From Time is required'),
  timingsTo: yup.string()
    .required('To Time is required')
    .test(
      'is-greater-than-timingsFrom',
      'To Time must be greater than From Time',
      function (value) {
        const { timingsFrom } = this.parent;
        if (!timingsFrom || !value) return true;
        
        // Convert times to comparable values
        const fromTime = new Date(`2000-01-01T${timingsFrom}`);
        const toTime = new Date(`2000-01-01T${value}`);
        
        return toTime > fromTime;
      }
    ),
  time: yup.string().required('Time is required'),
};

export default function TimeRangeInput({ form, setValue, errors }: FormInputProps) {
  const { register, control, trigger } = form;
  const timingsFrom = useWatch({ control, name: "timingsFrom" });
  const timingsTo = useWatch({ control, name: "timingsTo" });

  const fromTimeRef = useRef<HTMLInputElement | null>(null);
  const toTimeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (timingsFrom && timingsTo) {
      const formatted = `${timingsFrom} - ${timingsTo}`;
      setValue("time", formatted);
      // Trigger validation when either time changes
      trigger(["timingsFrom", "timingsTo"]);
    }
  }, [timingsFrom, timingsTo, setValue, trigger]);

  const handleTimeInputClick = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    if (inputRef.current?.showPicker) {
      inputRef.current.showPicker();
    } else {
      inputRef.current?.focus(); // fallback
    }
  };

  const handleTimeChange = async (field: "timingsFrom" | "timingsTo", value: string) => {
    setValue(field, value);
    // Trigger validation for both fields when either changes
    await trigger(["timingsFrom", "timingsTo"]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-start gap-2 items-center">
        <Input
          id="timingsFrom"
          type="time"
          {...register("timingsFrom", {
            onChange: (e) => handleTimeChange("timingsFrom", e.target.value)
          })}
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
          {...register("timingsTo", {
            onChange: (e) => handleTimeChange("timingsTo", e.target.value)
          })}
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


