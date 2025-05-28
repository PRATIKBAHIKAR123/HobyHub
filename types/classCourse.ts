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
  onCopy: (index: number) => void;
} 