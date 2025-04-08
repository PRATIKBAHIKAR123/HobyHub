"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";
import withAuth from "../auth/withAuth";
import InquiryPopupScreen from "../components/InquiryPopupScreen";
import DeletePopupScreen from "../components/DeletePopupScreen";

const classes = Array(6).fill({
  title: "Yoga Classes",
  weekDay: "All day of week",
  time: "6:30-21:30",
  age: "10-70",
  session: 25,
  gender: "Male, Female",
  price: "$239 - $499",
});

function NavigationSkeleton() {
  return (
    <div className="flex gap-4 mb-8">
      {/* <Skeleton className="h-10 w-28" /> */}
    </div>
  );
}

function GridCardSkeleton() {
  return (
    <Card className="bg-neutral-50 rounded-[19px] border-2 border-[#e9e9e9]">
      <CardContent className="px-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between mt-[18px]">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
        <Skeleton className="w-full h-10 mt-4" />
      </CardContent>
    </Card>
  );
}

function ClassDetailsSkeleton() {
  return (
    <div className="">
      <NavigationSkeleton />
      
      {/* Header and Controls Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <GridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function ClassListSkeleton() {
  return (
    <div className="p-6">
      <NavigationSkeleton />
      
      {/* Header and Controls Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      <div className="gap-4 px-[30px] py-[15px] rounded-xl border border-1 border-gray">
        <Table>
          <TableHeader>
            <TableRow>
              {[...Array(8)].map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {[...Array(8)].map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ClassDetails() {
  const [isListView, setIsListView] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return isListView ? <ClassListSkeleton /> : <ClassDetailsSkeleton />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#767676] text-[22.70px] font-semibold">Classes</h2>
        <div className="flex gap-2">
          <ToggleGroup type="single" className="hidden md:block border-2 border-gray-300 rounded-md p-1">
            <ToggleGroupItem
              value="list"
              onClick={() => setIsListView(true)}
              className={clsx(isListView && "yellow-bg text-black")}
            >
              <Image src="/Icons/classes-menu-list.png" alt="class" height={18} width={18} />
            </ToggleGroupItem>

            <ToggleGroupItem
              value="grid"
              onClick={() => setIsListView(false)}
              className={clsx(!isListView && "yellow-bg text-black")}
            >
              <Image src="/Icons/Menu Candy Box.png" alt="class" height={18} width={18} />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="border-2 border-gray-300 rounded-md p-1 flex">
            <Button className="app-bg-color text-white">Online Classes</Button>
            <Button variant="outline" className="ml-1">Offline Classes</Button>
          </div>
        </div>
      </div>
      {!isListView && <ClassGridList />}
      {isListView && <ClassList />}
    </div>
  );
}

function ClassGridList() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClassToDelete, setSelectedClassToDelete] = useState<any>(null);

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Deleting class:', selectedClassToDelete);
    // After successful deletion, you might want to refresh the list
  };

  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {classes.map((item, index) => (
      <Card key={index} className="bg-neutral-50 rounded-[19px] border-2 border-[#e9e9e9]">
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
          <div className="flex justify-between gap-2 mt-4">
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedClassToDelete(item);
                setIsDeleteOpen(true);
              }}
              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
            >
              Delete
            </Button>
            <Button className="flex-1 app-bg-color">
              <div className="text-white text-[14px] font-medium font-['Minion_Pro']">Inquire Now</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
    <InquiryPopupScreen 
      open={isInquiryOpen} 
      setOpen={setIsInquiryOpen}
      classDetails={selectedClass}
    />
    <DeletePopupScreen 
      open={isDeleteOpen}
      setOpen={setIsDeleteOpen}
      onDelete={handleDelete}
    />
  </div>
}

function ClassList() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClassToDelete, setSelectedClassToDelete] = useState<any>(null);

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Deleting class:', selectedClassToDelete);
    // After successful deletion, you might want to refresh the list
  };

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
          <TableHead className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">Actions</TableHead>
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
            <TableCell className="justify-center text-black text-xs font-bold font-['Trajan_Pro']">
              <div className="flex gap-2">
                {/* <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedClassToDelete(c);
                    setIsDeleteOpen(true);
                  }}
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                >
                  Delete
                </Button> */}
                <Button className="flex-1 app-bg-color">
                  <div className="text-white text-[14px] font-medium">Inquire Now</div>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <InquiryPopupScreen 
      open={isInquiryOpen} 
      setOpen={setIsInquiryOpen}
      classDetails={selectedClass}
    />
    <DeletePopupScreen 
      open={isDeleteOpen}
      setOpen={setIsDeleteOpen}
      onDelete={handleDelete}
    />
  </div>
}

export default withAuth(ClassDetails);
