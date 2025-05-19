export interface Location {
  address: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: string;
  longitude: string;
  road: string;
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

export interface ClassCourseItem {
  className: string;
  category: string;
  type: string;
  timingsFrom: string;
  timingsTo: string;
  fromage: number;
  toage: number;
  fromcost: number;
  tocost: number;
  location?: {
    address: string;
    city: string;
  };
  contact?: {
    tutorFirstName: string;
    tutorLastName: string;
  };
}

export interface ClassCourseTableProps {
  items: ClassCourseItem[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  type: 'class' | 'course';
} 