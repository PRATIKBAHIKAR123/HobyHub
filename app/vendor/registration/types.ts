import { UseFormReturn, UseFormSetValue } from "react-hook-form";

export interface FormValues {
  type: string;
  className: string;
  category: string;
  subCategory: string;
  time: string;
  timingsFrom: string;
  timingsTo: string;
  weekdays: string[];
  fromage: string;
  toage: string;
  fromcost: string;
  tocost: string;
  gender: string;
  experienceLevel: string;
  noOfSessions: string;
  location: Location | null;
  contact: Contact | null;
  sessionFrom?: string;
  sessionTo?: string;
}

export interface Location {
  id: string;
  address: string;
  road: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: string;
  longitude: string;
}

export interface Contact {
  id: string;
  tutorFirstName: string;
  tutorLastName: string;
  tutorEmailID: string;
  tutorCountryCode: string;
  tutorPhoneNo: string;
  whatsappCountryCode: string;
  whatsappNo: string;
  tutorIntro: string;
  contactType: {
    primary: boolean;
    secondary: boolean;
    billing: boolean;
  };
}

export interface ContactType {
  primary: boolean;
  secondary: boolean;
  billing: boolean;
}

export interface InstituteDetailsForm {
  programTitle: string;
  instituteName: string;
  gstNumber: string;
  instituteType: string;
  instituteCategory: string;
  instituteSubCategory: string;
  instituteDescription: string;
  instituteAddress: string;
  instituteArea: string;
  instituteCity: string;
  instituteState: string;
  instituteCountry: string;
  institutePincode: string;
  instituteLatitude: string;
  instituteLongitude: string;
  instituteRoad: string;
}

export interface PersonalDetailsForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: string;
}

export interface DocumentsForm {
  profilePicture: File | null;
  coverPicture: File | null;
  gstCertificate: File | null;
  otherDocuments: File | null;
}

export interface FormInputProps {
  form: UseFormReturn<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: any;
}

export interface LocationData extends Omit<Location, 'id'> {
  id?: string;
}

export interface ContactData extends Omit<Contact, 'id'> {
  id?: string;
}

export interface Category {
  id: number;
  title: string;
  subcategories: {
    id: number;
    title: string;
    categoryId: number;
  }[];
}

export interface DirectoryItem {
  id: string;
  name: string;
  // Add other properties as needed
}