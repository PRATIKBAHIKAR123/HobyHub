import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import CostRangeInput from "../registration/costRangeInput";
import AgeRangeInput from "../registration/ageRangeInput";
import { Button } from "@/components/ui/button";
import { Category } from "@/app/homepage/categories";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { toast } from "sonner";
import { createCourse, VendorClassData } from "@/services/vendorService";
import { getAllCategories, getAllSubCategories } from "@/services/hobbyService";
import TimeRangeInput from "../registration/timeRangeInput";
import SessionRangeInput from "../registration/sessionRangeInput";
import { FormValues } from "../registration/types";

const classDetailsSchema = yup.object().shape({
  className: yup.string().required("Class name is required"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string().required("Sub category is required"),
  location: yup.mixed().nullable(),
  contact: yup.mixed().nullable(),
  type: yup.string().oneOf(['Regular', 'Online', 'Offline']).required("Class type is required"),
  time: yup.string(),
  timingsFrom: yup.string(),
  timingsTo: yup.string().test(
    'is-greater-than-timingsFrom',
    'To Time must be greater than or equal to From Time',
    function (value) {
      const { timingsFrom } = this.parent;
      if (!timingsFrom || !value) return true;
      return timingsFrom <= value;
    }
  ),
  gender: yup.string(),
  fromage: yup.string(),
  toage: yup.string().test(
    'is-greater-than-fromage',
    'The age must be greater than or equal to From Age',
    function (value) {
      const { fromage } = this.parent;
      if (!fromage || !value) return true;
      return Number(value) >= Number(fromage);
    }
  ),
  fromcost: yup.string(),
  tocost: yup.string().test(
    'is-greater-than-fromcost',
    'To cost must be greater than or equal to From cost',
    function (value) {
      const { fromcost } = this.parent;
      if (!fromcost || !value) return true;
      return Number(value) >= Number(fromcost);
    }
  ),
  weekdays: yup.array().of(yup.string().nullable()),
  experienceLevel: yup.string(),
  noOfSessions: yup.string(),
  sessionFrom: yup.string(),
  sessionTo: yup.string().test(
    'is-greater-than-sessionFrom',
    'To Session must be greater than or equal to From Session',
    function(value) {
      const { sessionFrom } = this.parent;
      if (!sessionFrom || !value) return true;
      return Number(value) >= Number(sessionFrom);
    }
  ),
  endDate: yup.string(),
  startDate: yup.string(),
});

interface PopupScreenProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit?: (courseForm: VendorClassData) => void;
  classData?: VendorClassData;
  activityId?: number;
}

export default function AddCoursePopup({ open, setOpen, onSubmit, classData, activityId }: PopupScreenProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form for class details
  const classForm = useForm<FormValues>({
    resolver: yupResolver(classDetailsSchema) as any,
    mode: "onChange",
    defaultValues: {
      type: 'Offline',
      className: '',
      category: '',
      subCategory: '',
      time: '',
      timingsFrom: '',
      timingsTo: '',
      weekdays: [],
      fromage: '',
      toage: '',
      fromcost: '',
      tocost: '',
      gender: 'both',
      experienceLevel: 'beginner',
      noOfSessions: '1',
      location: null,
      contact: null
    }
  });

  const {
    register: registerClass,
    handleSubmit: handleSubmitClass,
    setValue: setValueClass,
    watch: watchClass,
    formState: { errors: errorsClass },
  } = classForm;

  const handleWeekdayChange = (day: string) => {
    const currentWeekdays = watchClass('weekdays') || []; // Get current weekdays value

    // If day is already selected, remove it; otherwise, add it
    if (currentWeekdays.includes(day)) {
      setValueClass('weekdays', currentWeekdays.filter((d: any) => d !== null && d !== day));
    } else {
      setValueClass('weekdays', [...currentWeekdays.filter((d: any) => d !== null), day]);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [categoriesData, subCategoriesData] = await Promise.all([
          getAllCategories(),
          getAllSubCategories()
        ]);

        // Combine categories with their subcategories
        const categoriesWithSubs = categoriesData.map(cat => ({
          ...cat,
          subcategories: subCategoriesData.filter(sub => sub.categoryId === cat.id)
        }));

        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (classData) {
      setValueClass("className", classData.title || "");
      const parentCategory = categories.find(cat => 
        cat.subcategories.some(sub => sub.id === Number(classData.subCategoryID))
      );
      setValueClass("category", parentCategory?.title || "");
      setValueClass("subCategory", classData.subCategoryID || "");
      setValueClass("timingsFrom", classData.timingsFrom || "");
      setValueClass("timingsTo", classData.timingsTo || "");
      setValueClass("type", (classData.type as 'Regular' | 'Online' | 'Offline') || "Offline");
      setValueClass("weekdays", classData.day ? classData.day.split(",") : []);
      setValueClass("gender", classData.gender || "both");
      setValueClass("fromage", classData.ageFrom?.toString() || "");
      setValueClass("toage", classData.ageTo?.toString() || "");
      setValueClass("fromcost", classData.fromPrice?.toString() || "");
      setValueClass("tocost", classData.toPrice?.toString() || "");
      setValueClass("noOfSessions", classData.sessionTo?.toString() || "1");
      setValueClass("sessionFrom", classData.sessionFrom?.toString() || '0');
      setValueClass("sessionTo", classData.sessionTo?.toString() || "1");
      setValueClass("experienceLevel", classData.type || "");
    }
  }, [classData, categories, setValueClass]);

  const submitCourse = async (formData: FormValues) => {
    const courseData: VendorClassData = {
      id: classData?.id || 0,
      vendorId: classData?.vendorId,
      activityId: activityId,
      subCategoryID: formData.subCategory || '',
      title: formData.className,
      timingsFrom: formData.timingsFrom || '',
      timingsTo: formData.timingsTo || '',
      day: formData.weekdays?.join(',') || '',
      type: formData.type || 'Offline',
      ageFrom: parseInt(formData.fromage || '0'),
      ageTo: parseInt(formData.toage || '0'),
      sessionFrom: parseInt(formData.sessionFrom || '0'),
      sessionTo: parseInt(formData.sessionTo || '1'),
      gender: formData.gender || 'both',
      price: 0,
      fromPrice: parseInt(formData.fromcost || '0'),
      toPrice: parseInt(formData.tocost || '0'),
    };

    try {
      const data = await createCourse([courseData]);

      if (data.status === 200) {
        toast.success("New Course Added!");
        onSubmit?.(courseData);
        setOpen(false);
      } else {
        toast.error(String(data.data));
      }

    } catch (err) {
      console.log("err:", String(err));
      toast.error(String(err));
    }
  };

  const classCategory = watchClass("category");

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category.title.toString() === classCategory
    );

    if (selectedCategory && selectedCategory.subcategories.length > 0) {
      setValueClass("subCategory", selectedCategory.subcategories[0].id.toString());
    } else {
      setValueClass("subCategory", "");
    }
  }, [classCategory, categories, setValueClass]);

  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-[#003161] opacity-50 fixed inset-0" />
      
      <DialogContent className="bg-white p-6 min-w-[90%] rounded-xl overflow-y-scroll max-h-screen mx-auto text-center">
        <form onSubmit={handleSubmitClass(submitCourse)}>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                Course Name<span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Course Name"
                {...registerClass("className")}
                className="h-[52px] border-[#05244f]"
              />
              {errorsClass.className && (
                <p className="text-red-500 text-xs">{errorsClass.className.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                Category<span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValueClass("category", value)} value={watchClass("category") || ""}>
                <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories!.map((item) => (<SelectItem key={item.id} value={item.title.toString()}>{item.title}</SelectItem>))}
                </SelectContent>
              </Select>
              {errorsClass.category && (
                <p className="text-red-500 text-xs">{errorsClass.category.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">Sub Category</Label>
              <Select
                onValueChange={(value) => setValueClass("subCategory", value)}
                value={watchClass("subCategory") || ""}
              >
                <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                  <SelectValue placeholder="Sub Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .find((category) => category.title.toString() === watchClass("category"))?.subcategories.map((subCategory) => (
                      <SelectItem key={subCategory.id} value={subCategory.id.toString()}>
                        {subCategory.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">Type</Label>
              <Select onValueChange={(value: 'Regular' | 'Online' | 'Offline') => setValueClass("type", value)} 
                value={watchClass("type") || "Offline"}>
                <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Offline">In Person</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <SessionRangeInput 
              form={classForm}
              setValue={setValueClass}
              errors={errorsClass}
            />
            <CostRangeInput
              form={classForm}
              setValue={setValueClass}
              errors={errorsClass}
            />

            <div className="flex flex-col gap-2">
              <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                Time<span className="text-red-500">*</span>
              </Label>
              <TimeRangeInput 
                form={classForm}
                setValue={setValueClass}
                errors={errorsClass}
              />
              {errorsClass.time && (
                <p className="text-red-500 text-xs">{errorsClass.time.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 p-2 border border-[#05244f] rounded-md">
              {[
                'Monday', 'Tuesday', 'Wednesday',
                'Thursday', 'Friday', 'Saturday', 'Sunday'
              ].map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={day.toLowerCase()}
                    className="h-4 w-4 border-[#05244f]"
                    onChange={() => handleWeekdayChange(day)}
                    checked={(watchClass('weekdays') || []).includes(day)}
                  />
                  <label htmlFor={day.toLowerCase()} className="text-sm">{day}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 p-2 border border-[#05244f] rounded-md">
            <div className="text-[#05244f] text-md font-bold my-4 trajan-pro flex items-center">
              Course criteria
            </div>
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Gender</Label>
                <Select value={watchClass("gender") || ""} onValueChange={(value) => setValueClass("gender", value)}>
                  <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Trans">Trans</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AgeRangeInput
                form={classForm}
                setValue={setValueClass}
                errors={errorsClass}
              />

              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">Prior Knowledge</Label>
                <Select value={watchClass("experienceLevel") || ""} onValueChange={(value) => setValueClass("experienceLevel", value)}>
                  <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                    <SelectValue placeholder="Prior Knowledge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="my-4 app-bg-color text-white flex justify-end"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}