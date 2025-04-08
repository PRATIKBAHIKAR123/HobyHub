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
            <Button 
              className="flex-1 app-bg-color"
              onClick={() => setIsInquiryOpen(true)}
            >
              <div className="text-white text-[14px] font-medium font-['Minion_Pro']">Inquire Now</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
    <InquiryPopupScreen 
      isOpen={isInquiryOpen} 
      onClose={() => setIsInquiryOpen(false)}
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClassToDelete, setSelectedClassToDelete] = useState<any>(null);

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Deleting class:', selectedClassToDelete);
    setIsDeleteOpen(false);
    // After successful deletion, you might want to refresh the list
  };

  return (
    <div className="gap-4 px-[30px] py-[15px] rounded-xl border border-1 border-gray">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Schedule Time</TableHead>
            <TableHead>Age Group</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Sessions</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.sno}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.schedule}</TableCell>
              <TableCell>{item.scheduletime}</TableCell>
              <TableCell>{item.agegroup}</TableCell>
              <TableCell>{item.gender}</TableCell>
              <TableCell>{item.stratdate}</TableCell>
              <TableCell>{item.enddate}</TableCell>
              <TableCell>{item.sessions}</TableCell>
              <TableCell>{item.cost}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedClassToDelete(item);
                      setIsDeleteOpen(true);
                    }}
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                  <Button 
                    className="app-bg-color"
                    onClick={() => setIsInquiryOpen(true)}
                  >
                    <div className="text-white text-[14px] font-medium font-['Minion_Pro']">Inquire Now</div>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InquiryPopupScreen 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)}
      />
      <DeletePopupScreen 
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default withAuth(ClassDetails);
