"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import clsx from "clsx";


const classes = Array(6).fill({
  title: "Yoga Classes",
  weekDay: "All day of week",
  time: "6:30-21:30",
  age: "10-70",
  session: 25,
  gender: "Male, Female",
  price: "$239 - $499",
});

export default function ClassDetails() {
    const [isListView, setIsListView] = useState<boolean>(true);
  return (
    <div className="p-6">
      

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#767676] text-[22.70px] font-semibold ">Classes</h2>
        <div className="flex gap-2">
        <ToggleGroup
      type="single"
      className="hidden md:block border-2 border-gray-300 rounded-md p-1"
    >
      <ToggleGroupItem
        value="list"
        onClick={() => setIsListView(true)}
        className={clsx(isListView && "yellow-bg text-black")}
      >
        <Image
          src="/Icons/classes-menu-list.png"
          alt="class"
          height={18}
          width={18}
        />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="grid"
        onClick={() => setIsListView(false)}
        className={clsx(!isListView && "yellow-bg text-black")}
      >
        <Image
          src="/Icons/Menu Candy Box.png"
          alt="class"
          height={18}
          width={18}
        />
      </ToggleGroupItem>
    </ToggleGroup>
          <div className="border-2 border-gray-300 rounded-md p-1 flex">
          <Button className="app-bg-color text-white">Online Classes</Button>
          <Button variant="outline" className="ml-1">Offline Classes</Button>
          </div>
        </div>
      </div>
      { !isListView &&(<ClassGridList />)}
     { isListView &&(<ClassList/>)}
    </div>
  );
}

 function ClassGridList() {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {classes.map((item, index) => (
    <Card key={index} className=" bg-neutral-50 rounded-[19px] border-2 border-[#e9e9e9]">
      <CardContent className="px-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Image src="/images/yoga-img.png" alt="class" height={48} width={48}/><span className="text-black text-[18px] font-normal font-['Trajan_Pro'] mt-1">{item.title}</span> 
        </h3>
        <p className="flex justify-between mt-[18px] text-black text-sm font-bold font-['Trajan_Pro']"><strong>Week Day:</strong> <p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']">{item.weekDay}</p></p>
        <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro'] "><strong>Time:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']"> {item.time}</p></p>
        <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro']"><strong>Age:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']"> {item.age}</p></p>
        <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro']"><strong>Session:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']"> {item.session}</p></p>
        <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro']"><strong>Gender:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']"> {item.gender}</p></p>
        <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro']"><strong>Price:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']"> {item.price}</p></p>
        <Button  className="w-full app-bg-color mt-4"><div className=" text-white text-[14px] font-medium font-['Minion_Pro']">Inquire Now</div></Button>
      </CardContent>
    </Card>
  ))}
</div>
}

function ClassList() {
  const classes = [
    {
      sno: "01",
      name:'Beginner Piano Lessons',
      schedule: "Mon , Wed",
      scheduletime: "5 PIM to 6 PM",
      agegroup: "6-10 Years",
      gender: "Boys/Girls",
      stratdate: "16-0-24",
      enddate: "16-0-24",
      sessions:12,
      cost:'$250'
    },
    {
      sno: "02",
      name:'Beginner Piano Lessons',
      schedule: "Mon , Wed",
      scheduletime: "5 PIM to 6 PM",
      agegroup: "6-10 Years",
      gender: "Boys/Girls",
      stratdate: "16-0-24",
      enddate: "16-0-24",
      sessions:12,
      cost:'$250'
    },
  ]
  
  return <div className="gap-4 px-[30px] py-[15px] rounded-xl border border-1 border-gray">
  <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">Class Name</TableHead>
            <TableHead className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">Schedule </TableHead>
            <TableHead className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">Age group</TableHead>
            <TableHead className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">Start date</TableHead>
            <TableHead className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">End date</TableHead>
            <TableHead className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">No. of Sessions</TableHead>
            <TableHead className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">Cost ($)</TableHead>
            <TableHead className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((c) => (
            <TableRow key={c.sno}>
              <TableCell className="justify-center text-black text-xs font-bold font-['Trajan_Pro']" width={10}>{c.name}</TableCell>
              
              <TableCell className="justify-center">
                <div className="items-center gap-2">
                <div className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">{c.schedule}</div>
                    <div className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">{c.scheduletime}</div>
              </div>
              </TableCell>
              <TableCell className="justify-center">
                <div className="items-center gap-2">
                <div className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">{c.agegroup}</div>
                    <div className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">{c.gender}</div>
              </div>
              </TableCell>
              <TableCell className="justify-center text-black text-xs font-bold font-['Trajan_Pro']" >{c.stratdate}</TableCell>
              <TableCell className="justify-center text-black text-xs font-bold font-['Trajan_Pro']" >{c.enddate}</TableCell>
              <TableCell className="justify-center text-black text-xs font-bold font-['Trajan_Pro']" >{c.sessions}</TableCell>
              <TableCell className="justify-center text-black text-xs font-bold font-['Trajan_Pro']" >{c.cost}</TableCell>
              <TableCell className="justify-center text-black text-xs font-bold font-['Trajan_Pro']" ><Button  className="w-full app-bg-color mt-4"><div className=" text-white text-[14px] font-medium ">Inquire Now</div></Button></TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
  
</div>
}
