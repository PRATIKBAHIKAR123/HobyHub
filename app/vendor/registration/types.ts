import { UseFormReturn, UseFormSetValue } from "react-hook-form";

export type FormValues = {
  className: string;
  category: string;
  subCategory?: string;
  location?: string;
  contact?: string;
  time: string;
  gender?: string;
  fromage?: string;
  toage?: string;
  age?: string;
  fromcost?: string;
  tocost?: string;
  cost?: string;
  classSize?: string;
  weekdays?: (string | null | undefined)[];
  experienceLevel?: string;
  noOfSessions?: string;
  type: 'Regular' | 'Online' | 'Offline';

};

export interface FormInputProps {
  form: UseFormReturn<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: any;
} 