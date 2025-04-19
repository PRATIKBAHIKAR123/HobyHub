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

// const classes = [
//   {
//     sno: 1,
//     name: "Yoga for Beginners",
//     schedule: "Monday, Wednesday, Friday",
//     scheduletime: "09:00 - 10:00",
//     agegroup: "18-45",
//     gender: "Mixed",
//     stratdate: "2024-04-01",
//     enddate: "2024-06-30",
//     sessions: 12,
//     cost: "$299"
//   },
//   {
//     sno: 2,
//     name: "Advanced Pilates",
//     schedule: "Tuesday, Thursday",
//     scheduletime: "18:00 - 19:30",
//     agegroup: "25-50",
//     gender: "Female",
//     stratdate: "2024-04-02",
//     enddate: "2024-07-02",
//     sessions: 8,
//     cost: "$399"
//   },
//   {
//     sno: 3,
//     name: "Kids Dance Class",
//     schedule: "Saturday",
//     scheduletime: "10:00 - 11:30",
//     agegroup: "5-12",
//     gender: "Mixed",
//     stratdate: "2024-04-06",
//     enddate: "2024-06-29",
//     sessions: 6,
//     cost: "$199"
//   },
//   {
//     sno: 4,
//     name: "Zumba Fitness",
//     schedule: "Monday, Wednesday",
//     scheduletime: "19:00 - 20:00",
//     agegroup: "16-60",
//     gender: "Mixed",
//     stratdate: "2024-04-01",
//     enddate: "2024-06-30",
//     sessions: 10,
//     cost: "$249"
//   },
//   {
//     sno: 5,
//     name: "Meditation Workshop",
//     schedule: "Sunday",
//     scheduletime: "15:00 - 16:30",
//     agegroup: "18+",
//     gender: "Mixed",
//     stratdate: "2024-04-07",
//     enddate: "2024-06-30",
//     sessions: 4,
//     cost: "$179"
//   }
// ];

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
  const [classes, setClasses] = useState([]);
  const [filterType, setFilterType] = useState('Online');

  // Simulate loading
  useEffect(() => {
    const classList = sessionStorage.getItem('activityClassData');
    const parsedClassList = classList ? JSON.parse(classList) : [];
    setClasses(parsedClassList);
console.log(classes)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Reduced loading time for better UX
    return () => clearTimeout(timer);
  }, []);

  if (!classes.length && !isLoading) {
    return (
      <div className="flex items-center justify-center top-[50%] w-full absolute">
        <span className="text-bold">No Classes Available</span>
      </div>
    );
  }

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
            <Button variant={`${filterType=='Online'?'default':'outline'}`} onClick={() => setFilterType('Online')}>Online Classes</Button>
            <Button variant={`${filterType=='Offline'?'default':'outline'}`} className="ml-1" onClick={() => setFilterType('Offline')}>Offline Classes</Button>
          </div>
        </div>
      </div>
      {!isListView && <ClassGridList classes={classes} />}
      {isListView && <ClassList classes={classes} />}
    </div>
  );
}

function ClassGridList({ classes }:any) {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedClassToDelete, setSelectedClassToDelete] = useState<any>(null);

  const handleDelete = () => {
    // Handle delete logic here
    console.log('Deleting class:', selectedClassToDelete);
    // After successful deletion, you might want to refresh the list
  };

  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {classes.map((item:any, index:number) => (
      <Card key={index} className="bg-neutral-50 rounded-[19px] border-2 border-[#e9e9e9]">
        <CardContent className="px-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Image src="/images/yoga-img.png" alt="class" height={48} width={48}/><span className="text-black text-[18px] font-normal font-['Trajan_Pro'] mt-1">{item.title}</span> 
          </h3>
          <p className="flex justify-between mt-[18px] text-black text-sm font-bold font-['Trajan_Pro']"><strong>Week Day:</strong> <p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']">{item.day}</p></p>
          <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro'] "><strong>Time:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']"> {item.timingsFrom} - {item.timingsTo}</p></p>
          <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro']"><strong>Age:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']"> {item.ageFrom} - {item.ageTo}</p></p>
          <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro']"><strong>Session:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']"> {item.sessionFrom}</p></p>
          <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro']"><strong>Gender:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']"> {item.gender}</p></p>
          <p className="flex justify-between mt-[18px]  text-black text-sm font-bold font-['Trajan_Pro']"><strong>Price:</strong><p className="text-[#aaaaaa] text-sm font-bold font-['Trajan_Pro']">{item.fromPrice} - {item.toPrice}</p></p>
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

function ClassList({ classes }:any) {
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
          {classes.map((item:any, index:number) => (
            <TableRow key={index}>
              <TableCell>{index +1}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.day}</TableCell>
              <TableCell>{item.timingsFrom} - {item.timingsTo}</TableCell>
              <TableCell>{item.ageFrom} - {item.ageTo}</TableCell>
              <TableCell>{item.gender}</TableCell>
              <TableCell>{item.sessionFrom}</TableCell>
              <TableCell>{item.sessionTo}</TableCell>
              <TableCell>{item.sessionFrom}</TableCell>
              <TableCell>{item.fromPrice} - {item.toPrice}</TableCell>
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
