import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { FormInputProps } from "./types";

// Generate hour, minute, and AM/PM options
const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? "12" : String(i).padStart(2, "0")));
const minutes = ["00", "15", "30", "45"];
const ampm = ["AM", "PM"];

// Convert to 24-hour format for logic/validation
function to24Hour(hour: string, minute: string, period: string) {
  let h = parseInt(hour, 10);
  if (period === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return `${h.toString().padStart(2, "0")}:${minute}`;
}

// Convert from 24-hour to 12-hour for dropdowns
function from24Hour(time: string) {
  if (!time) return { hour: "12", minute: "00", period: "AM" };
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  let hour = h % 12;
  if (hour === 0) hour = 12;
  return { hour: hour.toString().padStart(2, "0"), minute: m.toString().padStart(2, "0"), period };
}

function TimeDropdown({
  
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const { hour, minute, period } = from24Hour(value);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* <span className="text-xs text-gray-500 font-medium mb-1">{label}</span> */}
      <div className="flex gap-1">
        <select
          className="rounded-lg border border-[#05244f] px-2 py-2 bg-white text-base focus:ring-2 focus:ring-[#05244f]"
          value={hour}
          onChange={e => onChange(to24Hour(e.target.value, minute, period))}
        >
          {hours.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
        {/* <span className="font-bold text-gray-400">:</span> */}
        <select
          className="rounded-lg border border-[#05244f] px-2 py-2 bg-white text-base focus:ring-2 focus:ring-[#05244f]"
          value={minute}
          onChange={e => onChange(to24Hour(hour, e.target.value, period))}
        >
          {minutes.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          className="rounded-lg border border-[#05244f] px-2 py-2 bg-white text-base focus:ring-2 focus:ring-[#05244f]"
          value={period}
          onChange={e => onChange(to24Hour(hour, minute, e.target.value))}
        >
          {ampm.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

export default function TimeRangeInput({ form, setValue, errors }: FormInputProps) {
  const { control, trigger } = form;
  const timingsFrom = useWatch({ control, name: "timingsFrom" }) || "00:00";
  const timingsTo = useWatch({ control, name: "timingsTo" }) || "00:00";

  useEffect(() => {
    if (timingsFrom && timingsTo) {
      const formatted = `${timingsFrom} - ${timingsTo}`;
      setValue("time", formatted);
      trigger(["timingsFrom", "timingsTo"]);
    }
  }, [timingsFrom, timingsTo, setValue, trigger]);

  useEffect(() => {
  if (!timingsFrom) setValue("timingsFrom", "00:00");
  if (!timingsTo) setValue("timingsTo", "00:00");
  // eslint-disable-next-line
}, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <TimeDropdown
          label="From"
          value={timingsFrom}
          onChange={val => {
            setValue("timingsFrom", val);
            trigger(["timingsFrom", "timingsTo"]);
          }}
          error={errors.timingsFrom?.message}
        />
        <span className="text-gray-400 font-bold text-lg mx-2">To</span>
        <TimeDropdown
          label="To"
          value={timingsTo}
          onChange={val => {
            setValue("timingsTo", val);
            trigger(["timingsFrom", "timingsTo"]);
          }}
          error={errors.timingsTo?.message}
        />
      </div>
    </div>
  );
}