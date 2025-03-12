
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useSidebar } from "../sidebar/sidebarContext";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export default function HomeNavbar() {
    const { toggleSidebar } = useSidebar();
    return (
        <>
            <div className="hidden md:block">
                <div className="w-full h-[67.88px] bg-[#003161] border-b border-[#dee2e6] justify-between flex">
                    <div className="p-4">
                        <Image src="/images/HobyHub.ai.png" alt="Logo" width={150} height={36} />
                    </div>
                    <div className="bg-white/10 rounded-lg px-4 gap-4 py-2 flex ">
                        <div className="w-2/12 pl-[3.17px] pr-[3.29px] justify-center gap-[3px] items-center inline-flex">
                            <Image src="/Icons/location.svg" alt="Logo" width={13} height={15} />
                            <div className="w-[24.95px] h-[18px] text-center text-[#f8f9fa] text-[10.31px] font-normal font-['Inter'] leading-[18px]">Pune</div>
                        </div>
                        <div className="w-7/12 h-[44.38px] p-[3.19px] bg-white rounded-md shadow-[0px_8px_16px_0px_rgba(0,0,0,0.15)] justify-center items-start gap-[0px] inline-flex">
                            <div className="grow shrink basis-0 self-stretch px-3 pt-[11px] pb-2 bg-white rounded-md justify-center items-center inline-flex overflow-hidden">
                                <div className="grow shrink basis-0 h-[19px] pr-[400.72px] pt-px pb-0.5 justify-start items-center inline-flex overflow-hidden">
                                    <div className="w-[42.73px] h-4 text-[#212529]/75 text-[12.88px] font-normal font-['Inter']">Search</div>
                                </div>
                            </div>
                            <div data-svg-wrapper>
                                <svg width="43" height="39" viewBox="0 0 43 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M26.8599 15.9399C26.8599 17.3743 26.3942 18.6993 25.6099 19.7743L29.5661 23.7337C29.9567 24.1243 29.9567 24.7587 29.5661 25.1493C29.1755 25.5399 28.5411 25.5399 28.1505 25.1493L24.1942 21.1899C23.1192 21.9774 21.7942 22.4399 20.3599 22.4399C16.7692 22.4399 13.8599 19.5306 13.8599 15.9399C13.8599 12.3493 16.7692 9.43994 20.3599 9.43994C23.9505 9.43994 26.8599 12.3493 26.8599 15.9399ZM20.3599 20.4399C20.9508 20.4399 21.536 20.3235 22.0819 20.0974C22.6279 19.8713 23.124 19.5398 23.5418 19.1219C23.9597 18.7041 24.2912 18.208 24.5173 17.662C24.7435 17.1161 24.8599 16.5309 24.8599 15.9399C24.8599 15.349 24.7435 14.7638 24.5173 14.2179C24.2912 13.6719 23.9597 13.1758 23.5418 12.758C23.124 12.3401 22.6279 12.0086 22.0819 11.7825C21.536 11.5563 20.9508 11.4399 20.3599 11.4399C19.7689 11.4399 19.1838 11.5563 18.6378 11.7825C18.0918 12.0086 17.5957 12.3401 17.1779 12.758C16.76 13.1758 16.4286 13.6719 16.2024 14.2179C15.9763 14.7638 15.8599 15.349 15.8599 15.9399C15.8599 16.5309 15.9763 17.1161 16.2024 17.662C16.4286 18.208 16.76 18.7041 17.1779 19.1219C17.5957 19.5398 18.0918 19.8713 18.6378 20.0974C19.1838 20.3235 19.7689 20.4399 20.3599 20.4399Z" fill="#212529" />
                                </svg>
                            </div>
                        </div>
                        <div className="w-3/12 flex items-center justify-between">
                            <div className="px-1">
                                <button className="text-white flex items-center gap-2">
                                    <Image src="/Icons/filter.svg" alt="Logo" width={30} height={22} />
                                    <span className="text-[#f8f9fa] text-sm font-normal font-['Inter']">Filter</span>
                                </button>
                            </div>
                        </div>
                        <div className="px-3 w-full">
                            <div className="flex-col float-right items-center gap-2 cursor-pointer">
                                <Switch className="w-[3.2em] data-[state=checked]:bg-[#1e90ff] data-[state=unchecked]:bg-[#808080]"/>
                                <Label className="text-center text-[#f8f9fa] text-[9.94px] font-normal font-['Inter'] leading-[18px]">Offline Classes</Label>
                            </div>
                        </div>
                        {/* <div className="w-[62.08px] justify-center items-center inline-flex">
                            <div data-svg-wrapper className="relative">
                                <Image src="/Icons/filter.svg" alt="Logo" width={30} height={22} />
                            </div>
                            <div className="w-[32.28px] h-[15px] text-[#f8f9fa] text-sm font-normal font-['Inter'] leading-snug">Filter</div>
                        </div> */}

                        {/* <div className="h-[15px] pl-[3px] pr-[35px] pt-[3px] pb-0.5  justify-center items-center col:flex">
                        
                        <Switch/>
                        <div className="text-center text-[#f8f9fa] text-[9.94px] font-normal font-['Inter'] leading-[18px]">Offline Classes</div>
                        </div> */}
                    </div>
                    <div className="flex gap-4 p-4">
                        <Link href={'/auth/login'} >
                            <Image src="/Icons/heart.svg" alt="Logo" width={25} height={25} />
                        </Link>
                        <Link href={'/auth/login'} >
                            <Image src="/Icons/user.svg" alt="Logo" width={25} height={25} />
                        </Link>
                        <div data-svg-wrapper className="justify-center items-center col:flex" onClick={toggleSidebar}>
                            <Image src="/Icons/hamburger.svg" alt="Logo" width={25} height={25} />
                            <div className="text-[#f8f9fa] text-sm font-normal font-['Inter'] leading-snug">Menu</div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="md:hidden sm:block  sm:block">
                <div className="w-full h-[169px] flex:col bg-[#003161] border-b border-[#dee2e6] justify-between">
                    <div className="justify-between flex">
                        <div className="p-4">
                            <Image src="/images/HobyHub.ai.png" alt="Logo" width={152} height={36} />
                        </div>
                        <div className="flex gap-4 p-4">
                            <Image src="/Icons/heart.svg" alt="Logo" width={24} height={30} />
                            <Image src="/Icons/user.svg" alt="Logo" width={36} height={35} />
                        </div>
                    </div>
                    <div className="justify-between flex px-2">
                        <div data-svg-wrapper className="flex-col text-center align-center">
                            <Image src="/Icons/hamburger.svg" className="inline-flex" alt="Logo" width={25} height={25} />
                            <div className="text-[#f8f9fa] text-sm font-normal font-['Inter'] leading-snug">Menu</div>
                        </div>
                        <div className="w-[298px] h-[44.38px] p-[3.19px] bg-white rounded-md shadow-[0px_8px_16px_0px_rgba(0,0,0,0.15)] justify-center items-start gap-[0px] inline-flex">
                            <div className="grow shrink basis-0 self-stretch px-3 pt-[11px] pb-2 bg-white rounded-md justify-center items-center inline-flex overflow-hidden">
                                <div className="grow shrink basis-0 h-[19px] pr-[400.72px] pt-px pb-0.5 justify-start items-center inline-flex overflow-hidden">
                                    <div className="w-[42.73px] h-4 text-[#212529]/75 text-[12.88px] font-normal font-['Inter']">Search</div>
                                </div>
                            </div>
                            <div data-svg-wrapper>
                                <svg width="43" height="39" viewBox="0 0 43 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M26.8599 15.9399C26.8599 17.3743 26.3942 18.6993 25.6099 19.7743L29.5661 23.7337C29.9567 24.1243 29.9567 24.7587 29.5661 25.1493C29.1755 25.5399 28.5411 25.5399 28.1505 25.1493L24.1942 21.1899C23.1192 21.9774 21.7942 22.4399 20.3599 22.4399C16.7692 22.4399 13.8599 19.5306 13.8599 15.9399C13.8599 12.3493 16.7692 9.43994 20.3599 9.43994C23.9505 9.43994 26.8599 12.3493 26.8599 15.9399ZM20.3599 20.4399C20.9508 20.4399 21.536 20.3235 22.0819 20.0974C22.6279 19.8713 23.124 19.5398 23.5418 19.1219C23.9597 18.7041 24.2912 18.208 24.5173 17.662C24.7435 17.1161 24.8599 16.5309 24.8599 15.9399C24.8599 15.349 24.7435 14.7638 24.5173 14.2179C24.2912 13.6719 23.9597 13.1758 23.5418 12.758C23.124 12.3401 22.6279 12.0086 22.0819 11.7825C21.536 11.5563 20.9508 11.4399 20.3599 11.4399C19.7689 11.4399 19.1838 11.5563 18.6378 11.7825C18.0918 12.0086 17.5957 12.3401 17.1779 12.758C16.76 13.1758 16.4286 13.6719 16.2024 14.2179C15.9763 14.7638 15.8599 15.349 15.8599 15.9399C15.8599 16.5309 15.9763 17.1161 16.2024 17.662C16.4286 18.208 16.76 18.7041 17.1779 19.1219C17.5957 19.5398 18.0918 19.8713 18.6378 20.0974C19.1838 20.3235 19.7689 20.4399 20.3599 20.4399Z" fill="#212529" />
                                </svg>
                            </div>
                        </div>
                        <div className="w-[62.08px]  justify-center items-center col:flex">
                            <div data-svg-wrapper className="relative">
                                <Image src="/Icons/filter.svg" alt="Logo" width={30} height={22} />
                            </div>
                            <div className="w-[32.28px] h-[15px] text-[#f8f9fa] text-sm font-normal font-['Inter'] leading-snug">Filter</div>
                        </div>
                    </div>

                    <div className="bg-white/10 rounded-lg flex p-2 justify-between items-center">
                        <div className="pl-[3.17px] pr-[3.29px] justify-center gap-[3px] inline-flex">
                            <Image src="/Icons/location.svg" alt="Logo" width={13} height={15} />
                            <div className="w-[24.95px] h-[18px] text-center text-[#f8f9fa] text-[10.31px] font-normal font-['Inter'] leading-[18px]">Pune</div>
                        </div>
                        <div className="pl-[3px] pr-[35px] pt-[3px] pb-0.5 rounded-[20px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] justify-between items-center inline-flex gap-2">
                            {/* <div className="w-2.5 h-2.5 bg-white rounded-[5px]" ></div> */}

                            <div className="text-center text-[#f8f9fa] text-[9.94px] font-normal font-['Inter'] leading-[18px]">Offline Classes</div>
                            <Switch />
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
}
