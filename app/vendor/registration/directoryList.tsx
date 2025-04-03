import { Button } from "@/components/ui/button";
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
  
  const invoices = [
    {
      sno: "01",
      text: "Some Line is gonna come here Need to figure out",
      image: "/images/table.png",
      extra: "Something",
    },
    {
        sno: "02",
        text: "Some Line is gonna come here Need to figure out",
        image: "/images/table.png",
        extra: "Something",
      },
  ]
  
  export function DirectoryTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] justify-center text-black text-[12px] font-normal trajan-pro">S No.</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Address</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Contact Info</TableHead>
            <TableHead className="justify-center text-black text-[12px] font-normal trajan-pro">Primary Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.sno}>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro" width={1}>{invoice.sno}</TableCell>
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro">{invoice.text}</TableCell>
              <TableCell width={2}>
                <div className="flex items-center gap-2">
                    <Image src={invoice.image} height={70} width={70} alt="invoice.sno"/>
                    <div className="justify-center text-black text-[12px] font-normal trajan-pro">{invoice.text}</div>
              </div>
              </TableCell>
              
              <TableCell className="justify-center text-black text-[12px] font-normal trajan-pro">{invoice.extra}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
          <TableCell ></TableCell>
            <TableCell ><Button variant="outline" className="border-[#05244f] mt-4" >+ Add Class Details</Button></TableCell>
            <TableCell ><Button variant="outline" className="border-[#05244f] mt-4" >+ Add Class Details</Button></TableCell>
            <TableCell ></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
  