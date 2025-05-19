import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import Image from "next/image";
  import { Button } from "@/components/ui/button";
  import { Trash2 } from "lucide-react";
  
  export interface DirectoryItem {
    address: string;
    isPrimary: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    whatsappNumber: string;
    email: string;
    contactType: {
      primary: boolean;
      secondary: boolean;
      billing: boolean;
    };
  }

  interface DirectoryTableProps {
    directory: DirectoryItem[];
    handleDelete: (index: number) => void;
    // handleEditAddress: (index: number) => void;
    // handleEditContact: (index: number) => void;
  }
  
  export function DirectoryTable({ directory, handleDelete }: DirectoryTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] justify-center text-black text-[12px] font-normal trajan-pro">S No.</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Address</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Contact Info</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Primary</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directory.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro" width={1}>
                {index + 1}
              </TableCell>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro" width={462}>
                {item.address}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Image src='/images/mobile-encryption.jpg' height={70} width={70} alt="contact-image"/>
                  <div className="flex flex-col gap-2">
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">
                      {item.firstName} {item.lastName}
                    </div>
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">
                      Email: {item.email}
                    </div>
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">
                      Phone No: {item.phoneNumber}
                    </div>
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">
                      Whatsapp: {item.whatsappNumber}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro">
                {item.isPrimary}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-center text-[#05244f] text-sm">
              {directory.length === 0 ? 'No directory entries found' : `Total entries: ${directory.length}`}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
  