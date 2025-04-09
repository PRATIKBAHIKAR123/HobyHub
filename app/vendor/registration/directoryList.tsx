
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

  interface directoryTableProps {
    directory: DirectoryItem[];
    handleDelete: (index: number) => void;
    // handleEditAddress: (index: number) => void;
    // handleEditContact: (index: number) => void;
  }
  
  export function DirectoryTable({  directory }: directoryTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] justify-center text-black text-[12px] font-normal trajan-pro">S No.</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Address</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Contact Info</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Primary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directory.map((invoice , index) => (
            <TableRow key={index}>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro" width={1}>{index + 1}</TableCell>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro" width={462}>{invoice.address}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                    <Image src='/images/mobile-encryption.jpg' height={70} width={70} alt="invoice.sno"/>
                    <div className="flex-col gap-2">
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">{invoice.firstName} {invoice.lastName}</div>
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">Email: {invoice.email}</div>
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">Phone No: {invoice.phoneNumber}</div>
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">Whatsapp: {invoice.whatsappNumber}</div>
                    </div>
              </div>
              </TableCell>
              
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro">{invoice.isPrimary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
          {/* <TableCell ></TableCell>
            <TableCell >
              <Button variant="outline" className="border-[#05244f] mt-4" >+ Add Address</Button>
              </TableCell>
            <TableCell >
              <Button variant="outline" className="border-[#05244f] mt-4" >+ Add Contact</Button>
              </TableCell>
            <TableCell ></TableCell> */}
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
  