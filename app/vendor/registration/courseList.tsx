
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Edit, Trash } from "lucide-react";

  
 export interface ClassItem {
    className: string;
    category: string;
    location: string;
    contact: string;
    time:string;
    cost:string;
    weekdays:[];
  }

  interface ClassTableProps {
    classes: ClassItem[];
    handleDelete: (index: number) => void;
    handleEdit: (index: number) => void;
  }

  export function ClassTable({ classes,handleDelete,handleEdit }: ClassTableProps) {

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] justify-center text-black text-[12px] font-normal trajan-pro">S No.</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Class Name</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Category</TableHead>
            <TableHead className="text-center text-black text-[12px] font-normal trajan-pro">Location & Contact</TableHead>
            <TableHead className="text-center text-black text-[12px] font-normal trajan-pro">Weekdays</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Time</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes!.map((item,index) => (
            <TableRow key={index}>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro" width={1}>{index+1}</TableCell>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro">{item.className}</TableCell>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro">{item.category}
              
              </TableCell>
              
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro">
              <div className="flex flex-col items-center justify-center gap-2">
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">{item.location}</div>
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">{item.contact}</div>
              </div>
              </TableCell>
              <TableCell className="justify-center text-center text-black text-[12px] font-normal trajan-pro">{item.weekdays?.map((i: string, index: number) => (<span key={index}>{i}<br></br></span>))}</TableCell>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro">{item.time}</TableCell>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro">{item.cost}</TableCell>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro" width={1}>
              <div className="flex items-center justify-center gap-2">
                    <div className="justify-center text-black text-[10px] font-normal trajan-pro" onClick={() => handleEdit(index)} ><Edit/></div>
                    <div className="justify-center text-black text-[10px] font-normal trajan-pro" onClick={() => handleDelete(index)}><Trash/></div>
              </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
  