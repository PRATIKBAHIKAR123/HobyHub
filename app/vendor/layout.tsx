"use client";
import VendorNavbar from "./layouts/navbar";
// import Sidebar from "./layouts/sidebar";

// ✅ Mark this as a client component


export default function VenodrLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <VendorNavbar />
      <div>{children}</div>
      {/* <Sidebar/> */}
    </>
  );
}
