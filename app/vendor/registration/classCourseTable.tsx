import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClassCourseTableProps {
  items: any[];
  type: 'class' | 'course';
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export default function ClassCourseTable({ items, type, onEdit, onDelete }: ClassCourseTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Age Range</TableHead>
            <TableHead>Cost Range</TableHead>
            <TableHead>Weekdays</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.className}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>
                {item.fromage && item.toage ? `${item.fromage}-${item.toage} years` : '-'}
              </TableCell>
              <TableCell>
                {item.fromcost && item.tocost ? `₹${item.fromcost}-₹${item.tocost}` : '-'}
              </TableCell>
              <TableCell>
                {item.weekdays?.length > 0 ? item.weekdays.join(', ') : '-'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No {type}s added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 