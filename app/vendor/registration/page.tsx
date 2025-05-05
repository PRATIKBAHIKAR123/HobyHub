'use client';

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PopupScreen from "./addInfoPopupScreen";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DirectoryTable } from "./directoryList";
import { useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { registerVendor } from "@/app/services/vendorService";
import { CircleCheckBig } from "lucide-react";
import * as yup from "yup";
import { ClassTable } from "./classList";
import SuccessPopupScreen from "./SuccessPopupScreen";
import { Category } from "@/app/homepage/categories";
import { getAllSubCategories, getAllCategories } from "@/services/hobbyService";
import { DirectoryItem } from "./directoryList";
import CostRangeInput from "./costRangeInput";
import AgeRangeInput from "./ageRangeInput";
import { Checkbox } from "@/components/ui/checkbox";
// import { createClass, createCourse, VendorClassData } from "../../../services/vendorService";
import { FormValues } from "./types";
import ClassCourseTable from "./classCourseTable";
import DeletePopupScreen from "@/app/components/DeletePopupScreen";
import PreviewPopup from "./preview";
import TimeRangeInput from "./timeRangeInput";

// Personal details form schema
const personalDetailsSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  emailId: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  dob: yup.date().nullable().transform((value, originalValue) => {
    if (originalValue === '') return null;
    return value;
  }),
  profileImageFile: yup.mixed().nullable(),
});

// Institute details form schema
const instituteDetailsSchema = yup.object().shape({
  programTitle: yup.string().required("Program title is required"),
  instituteName: yup.string().required("Institute name is required"),
  since: yup.string(),
  gstNo: yup.string(),
  thumbnailImageFile: yup.mixed().required("Thumbnail image is required"),
  introduction: yup.string().required("Introduction is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  whatsappNumber: yup.string().nullable(),
  email: yup.string().email("Invalid email").required("Email is required"),
  experience: yup.string(),
  contactIntroduction: yup.string(),
  contactType: yup.object().shape({
    primary: yup.boolean(),
    secondary: yup.boolean(),
    billing: yup.boolean(),
  }),
  certifications: yup.mixed().nullable(),
  address: yup.string().required("Address is required"),
  road: yup.string(),
  landmark: yup.string().required("Landmark is required"),
  area: yup.string(),
  city: yup.string(),
  state: yup.string(),
  country: yup.string(),
  pincode: yup.string(),
  latitude: yup.number().nullable().transform((value) => value === '' ? null : value),
  longitude: yup.number().nullable().transform((value) => value === '' ? null : value),
  websiteName: yup.string(),
  classLevel: yup.string(),
  instagramAccount: yup.string(),
  youtubeAccount: yup.string(),
  categoryId: yup.number().required("Category is required"),
  purchaseMaterialIds: yup.string(),
  itemCarryText: yup.string(),
});

// Class details form schema
const classDetailsSchema = yup.object().shape({
  className: yup.string().required("Class name is required"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string(),
  timingsFrom:yup.string(),
  timingsTo:yup.string().test(
    'is-greater-than-timingsFrom',
    'To Time must be greater than or equal to From Time',
    function (value) {
      const { timingsFrom } = this.parent;
      if (!timingsFrom || !value) return true;
      return timingsFrom <= value;
    }
  ),
  time: yup.string(),
  type: yup.string().oneOf(['Regular', 'Online', 'Offline']).required("Class type is required"),
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
  age: yup.string(),
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
  cost: yup.string(),
  classSize: yup.string(),
  weekdays: yup.array().of(yup.string().nullable()),
  experienceLevel: yup.string(),
  noOfSessions: yup.string(),
  location: yup.string(),
  contact: yup.string()
});

// Course details form schema
const courseDetailsSchema = yup.object().shape({
  className: yup.string().required("Course name is required"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string(),
  time: yup.string(),
  timingsFrom:yup.string(),
  timingsTo:yup.string().test(
    'is-greater-than-timingsFrom',
    'To Time must be greater than or equal to From Time',
    function (value) {
      const { timingsFrom } = this.parent;
      if (!timingsFrom || !value) return true;
      return timingsFrom <= value;
    }
  ),
  type: yup.string().oneOf(['Regular', 'Online', 'Offline']).required("Course type is required"),
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
  age: yup.string(),
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
  cost: yup.string(),
  classSize: yup.string(),
  weekdays: yup.array().of(yup.string().nullable()),
  experienceLevel: yup.string(),
  noOfSessions: yup.string(),
  location: yup.string(),
  contact: yup.string()
});

export default function RegistrationForm() {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  // const [isInstDetailsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClassFields, setShowClassFields] = useState(false);
  const [showCourseFields, setShowCourseFields] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [activeAccordion, setActiveAccordion] = useState("item-0");
  const [categories, setCategories] = useState<Category[]>([]);
  const [completedSections, setCompletedSections] = useState({
    personalDetails: false,
    instituteDetails: false,
    classDetails: false
  });

  const [courses, setCourses] = useState<any[]>([]);

  const [directory, setDirectory] = useState<DirectoryItem[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Add these state variables at the top with other state declarations
  const [personalDetailsData, setPersonalDetailsData] = useState<any>(null);
  const [instituteDetailsData, setInstituteDetailsData] = useState<any>(null);
  const [classDetailsData, setClassDetailsData] = useState<any[]>([]);
  const [courseDetailsData, setCourseDetailsData] = useState<any[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [onDeleteCallback, setOnDeleteCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (showClassFields) {
      setActiveAccordion("item-4"); // Open the class accordion
      setShowCourseFields(false); // Close the course form
    }
  }, [showClassFields, setShowCourseFields]);

  useEffect(() => {
    if (showCourseFields) {
      setActiveAccordion("item-5"); // Open the course accordion
      setShowClassFields(false); // Close the class form
    }
  }, [showCourseFields, setShowClassFields]);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [setIsLoading]);

  useEffect(() => {
    if (!completedSections.personalDetails) {
      setActiveAccordion("item-0");
    } else if (!completedSections.instituteDetails) {
      setActiveAccordion("item-1");
    } else if (showClassFields) {
      setActiveAccordion("item-4");
    } else if (showCourseFields) {
      setActiveAccordion("item-5");
    } else {
      setActiveAccordion(""); // No default open if all sections are completed
    }
  }, [completedSections, showClassFields, showCourseFields]);

  // Form for personal details
  const personalForm = useForm({
    resolver: yupResolver(personalDetailsSchema),
    mode: "onChange",
  });

  // Form for institute details
  const instituteForm = useForm({
    resolver: yupResolver(instituteDetailsSchema),
    mode: "onChange",
    defaultValues: {
      programTitle: '',
      instituteName: '',
      since: '',
      gstNo: '',
      thumbnailImageFile: undefined,
      introduction: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      whatsappNumber: '',
      email: '',
      experience: '',
      contactIntroduction: '',
      contactType: {
        primary: false,
        secondary: false,
        billing: false,
      },
      certifications: null,
      address: '',
      road: '',
      landmark: '',
      area: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      latitude: 18.5204,
      longitude: 73.8567,
      websiteName: '',
      classLevel: '',
      instagramAccount: '',
      youtubeAccount: '',
      categoryId: undefined,
      purchaseMaterialIds: '',
      itemCarryText: ''
    }
  });

  // Form for class details
  const classForm = useForm<FormValues>({
    resolver: yupResolver(classDetailsSchema),
    mode: "onChange",
    defaultValues: {
      type: 'Offline',
      className: '',
      category: '',
      subCategory: '',
      time: '',
      timingsFrom:'',
      timingsTo:'',
      weekdays: [],
      fromage: '',
      toage: '',
      fromcost: '',
      tocost: '',
      gender: 'both',
      experienceLevel: 'beginner',
      noOfSessions: '1'
    }
  });

  // Form for course details
  const courseForm = useForm<FormValues>({
    resolver: yupResolver(courseDetailsSchema),
    mode: "onChange",
    defaultValues: {
      type: 'Offline',
      className: '',
      category: '',
      subCategory: '',
      timingsFrom:'',
      timingsTo:'',
      time: '',
      weekdays: [],
      fromage: '',
      toage: '',
      fromcost: '',
      tocost: '',
      gender: 'both',
      experienceLevel: 'beginner',
      noOfSessions: '1'
    }
  });

  // Destructure form methods
  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    setValue: setValuePersonal,
    watch: watchPersonal,
    formState: { errors: errorsPersonal },
  } = personalForm;

  const {
    register: registerInstitute,
    // handleSubmit: handleSubmitInstitute,
    setValue: setValueInstitute,
    watch: watchInstitute,
    formState: { errors: errorsInstitute },
  } = instituteForm;

  const {
    register: registerClass,
    handleSubmit: handleSubmitClass,
    setValue: setValueClass,
    watch: watchClass,
    formState: { errors: errorsClass },
    reset: resetClass
  } = classForm;

  const {
    register: registerCourse,
    handleSubmit: handleSubmitCourse,
    setValue: setValueCourse,
    watch: watchCourse,
    formState: { errors: errorsCourse },
    reset: resetCourse
  } = courseForm;

  // Load saved data from localStorage on component mount
  useEffect(() => {
    // Load personal details
    const savedPersonalDetails = localStorage.getItem('personalDetails');
    if (savedPersonalDetails) {
      const personalData = JSON.parse(savedPersonalDetails);
      Object.keys(personalData).forEach((key) => {
        setValuePersonal(key as keyof typeof personalDetailsSchema.fields, personalData[key]);
      });
      setCompletedSections(prev => ({ ...prev, personalDetails: true }));
    }

    // Load institute details
    const savedInstituteDetails = localStorage.getItem('instituteDetails');
    if (savedInstituteDetails) {
      const instituteData = JSON.parse(savedInstituteDetails);
      Object.keys(instituteData).forEach((key) => {
        setValueInstitute(key as keyof typeof instituteDetailsSchema.fields, instituteData[key]);
      });
      setCompletedSections(prev => ({ ...prev, instituteDetails: true }));
    }

    // Load saved images
    const savedImages = localStorage.getItem('images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, [setValuePersonal, setValueInstitute, setCourses, setValueClass, setValueCourse]);

  // Extract complex expressions
  const courseCategory = watchCourse("category");
  const classCategory = watchClass("category");

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category.title.toString() === courseCategory
    );

    if (selectedCategory && selectedCategory.subcategories.length > 0) {
      setValueCourse("subCategory", selectedCategory.subcategories[0].id.toString());
    } else {
      setValueCourse("subCategory", "");
    }
  }, [courseCategory, categories, setValueCourse]);

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

  const handleDeleteClass = (index: number) => {
    setDeleteMessage('Are you sure you want to delete this class?');
    setIsDeleteOpen(true);
    setOnDeleteCallback(() => () => {
      setClassDetailsData(prev => prev.filter((_, i) => i !== index));
      toast.success("Class deleted successfully!");
    });
  };

  const handleDeleteCourse = (index: number) => {
    setDeleteMessage('Are you sure you want to delete this course?');
    setIsDeleteOpen(true);
    setOnDeleteCallback(() => () => {
      setCourseDetailsData(prev => prev.filter((_, i) => i !== index));
      toast.success("Course deleted successfully!");
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      // Store the actual File objects
      setImages(files);

      // Create URLs for preview only
      const newImageUrls = files.map(file => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };

  // Save personal details to localStorage and proceed to the next section
  const savePersonalDetails = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Store personal details in state
      setPersonalDetailsData(data);
      
      // Mark section as completed and move to next
      setCompletedSections(prev => ({ ...prev, personalDetails: true }));
      setActiveAccordion("item-1");
      toast.success(`Personal details saved successfully!`);
    } catch (error) {
      console.error("Error saving personal details:", error);
      toast.error("An error occurred while saving personal details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new function to save institute details
  const saveInstituteDetails = async () => {
    try {
      setIsLoading(true);
      const data = watchInstitute();
      
      // Validate the form
      const isValid = await instituteForm.trigger();
      
      if (!isValid) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      // Store institute details in state
      setInstituteDetailsData(data);
      
      // Mark section as completed
      setCompletedSections(prev => ({ ...prev, instituteDetails: true }));
      
      // Open the institute images accordion
      setActiveAccordion("item-2");
      
      toast.success(`Institute details saved successfully!`);
    } catch (error) {
      console.error("Error saving institute details:", error);
      toast.error("An error occurred while saving institute details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the saveClassDetails function
  const saveClassDetails = async (data: any) => {
    console.log(data)
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!data.className) {
        toast.error("Class name is required");
        return;
      }
      
      if (!data.category) {
        toast.error("Category is required");
        return;
      }
      
      if (!data.timingsFrom || !data.timingsTo) {
        toast.error("Time is required");
        return;
      }
      
      if (!data.type) {
        toast.error("Class type is required");
        return;
      }
      
      if (!data.weekdays || data.weekdays.length === 0) {
        toast.error("Please select at least one weekday");
        return;
      }

      // Create a new class object with all the form data
      const newClass = {
        className: data.className,
        category: data.category,
        subCategory: data.subCategory,
        time: data.time,
        timingsFrom:data.timingsFrom,
        timingsTo:data.timingsTo,
        type: data.type,
        gender: data.gender || 'both',
        fromage: data.fromage || '',
        toage: data.toage || '',
        fromcost: data.fromcost || '',
        tocost: data.tocost || '',
        weekdays: data.weekdays,
        experienceLevel: data.experienceLevel || 'beginner',
        noOfSessions: data.noOfSessions || '1'
      };

      if (editIndex !== null) {
        // Update existing class
        setClassDetailsData(prev => {
          const newData = [...prev];
          newData[editIndex] = newClass;
          return newData;
        });
      } else {
        // Add new class
        setClassDetailsData(prev => [...prev, newClass]);
      }
      
      // Reset form and state
      setShowClassFields(false);
      setEditIndex(null);
      resetClass();
      toast.success("Class details saved successfully!");
    } catch (error) {
      console.error("Error saving class details:", error);
      toast.error("An error occurred while saving class details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the handleCourseSubmit function
  const handleCourseSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!data.className) {
        toast.error("Course name is required");
        return;
      }
      
      if (!data.category) {
        toast.error("Category is required");
        return;
      }
      
      if (!data.timingsFrom || !data.timingsTo) {
        toast.error("Time is required");
        return;
      }
      
      if (!data.type) {
        toast.error("Course type is required");
        return;
      }
      
      if (!data.weekdays || data.weekdays.length === 0) {
        toast.error("Please select at least one weekday");
        return;
      }

      // Create a new course object with all the form data
      const newCourse = {
        className: data.className,
        category: data.category,
        subCategory: data.subCategory,
        timingsFrom:data.timingsFrom,
        timingsTo:data.timingsTo,
        time: data.time,
        type: data.type,
        gender: data.gender || 'both',
        fromage: data.fromage || '',
        toage: data.toage || '',
        fromcost: data.fromcost || '',
        tocost: data.tocost || '',
        weekdays: data.weekdays,
        experienceLevel: data.experienceLevel || 'beginner',
        noOfSessions: data.noOfSessions || '1'
      };

      if (editIndex !== null) {
        // Update existing course
        setCourseDetailsData(prev => {
          const newData = [...prev];
          newData[editIndex] = newCourse;
          return newData;
        });
      } else {
        // Add new course
        setCourseDetailsData(prev => [...prev, newCourse]);
      }
      
      // Reset form and state
      setShowCourseFields(false);
      setEditIndex(null);
      resetCourse();
      toast.success("Course details saved successfully!");
    } catch (error) {
      console.error("Error saving course details:", error);
      toast.error("An error occurred while saving course details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the handleFinalSubmit function to properly include course details
  const handleFinalSubmit = async () => {
    try {
      // Validate personal details
      if (!personalDetailsData) {
        toast.error("Please complete Personal Details section");
        setActiveAccordion("item-0");
        return;
      }

      // Validate institute details
      if (!instituteDetailsData) {
        toast.error("Please complete Institute Details section");
        setActiveAccordion("item-1");
        return;
      }

      // Validate at least one class or course is added
      if (classDetailsData.length === 0 && courseDetailsData.length === 0) {
        toast.error("Please add at least one Class or Course");
        setActiveAccordion("item-4");
        return;
      }

      // Show preview popup instead of submitting immediately
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error preparing preview:", error);
      toast.error("An error occurred while preparing the preview. Please try again.");
    }
  };

  // New function to handle actual form submission after preview confirmation
  const handleSubmitAfterPreview = async () => {
    try {
      setIsLoading(true);
      
      // Create FormData object
      const formData = new FormData();

      // Add personal details
      if (personalDetailsData) {
        formData.append('name', personalDetailsData.name);
        formData.append('emailId', personalDetailsData.emailId);
        formData.append('phoneNumber', personalDetailsData.phoneNumber);
        formData.append('gender', personalDetailsData.gender);
        if (personalDetailsData.dob) {
          formData.append('dob', personalDetailsData.dob.toISOString());
        }
        if (personalDetailsData.profileImageFile instanceof File) {
          formData.append('profileImageFile', personalDetailsData.profileImageFile);
        }
      }

      // Add activity details
      if (instituteDetailsData) {
        formData.append('activity.type', 'INSTITUTE');
        formData.append('activity.categoryId', instituteDetailsData.categoryId.toString());
        formData.append('activity.title', instituteDetailsData.programTitle);
        formData.append('activity.companyName', instituteDetailsData.instituteName);
        formData.append('activity.description', instituteDetailsData.introduction || '');
        formData.append('activity.sinceYear', instituteDetailsData.since || '');
        formData.append('activity.gstNo', instituteDetailsData.gstNo || '');
        if (instituteDetailsData.thumbnailImageFile instanceof File) {
          formData.append('activity.thumbnailImageFile', instituteDetailsData.thumbnailImageFile);
        }
        if (images.length > 0 && images[0] instanceof File) {
          formData.append('activity.thumbnailImageFile', images[0]);
        }
        formData.append('activity.address', instituteDetailsData.address || '');
        formData.append('activity.road', instituteDetailsData.road || '');
        formData.append('activity.area', instituteDetailsData.area || '');
        formData.append('activity.state', instituteDetailsData.state || '');
        formData.append('activity.city', instituteDetailsData.city || '');
        formData.append('activity.pincode', instituteDetailsData.pincode || '');
        formData.append('activity.country', instituteDetailsData.country || '');
        formData.append('activity.longitude', (instituteDetailsData.longitude || 0).toString());
        formData.append('activity.latitude', (instituteDetailsData.latitude || 0).toString());
        formData.append('activity.purchaseMaterialIds', instituteDetailsData.purchaseMaterialIds || '');
        formData.append('activity.itemCarryText', instituteDetailsData.itemCarryText || '');
        formData.append('activity.tutorFirstName', instituteDetailsData.firstName);
        formData.append('activity.tutorLastName', instituteDetailsData.lastName);
        formData.append('activity.tutorEmailID', instituteDetailsData.email);
        formData.append('activity.tutorCountryCode', '+91');
        formData.append('activity.tutorPhoneNo', instituteDetailsData.phoneNumber);
        formData.append('activity.whatsappCountryCode', '+91');
        formData.append('activity.whatsappNo', instituteDetailsData.whatsappNumber || '');
        formData.append('activity.tutorIntro', instituteDetailsData.contactIntroduction || '');
        formData.append('activity.website', instituteDetailsData.websiteName || '');
        formData.append('activity.classLevel', instituteDetailsData.classLevel || '');
        formData.append('activity.instagramAcc', instituteDetailsData.instagramAccount || '');
        formData.append('activity.youtubeAcc', instituteDetailsData.youtubeAccount || '');
      }

      // Add activity images
      images.forEach((image) => {
        if (image instanceof File) {
          formData.append('activity.images', image);
        }
      });

      // Format class details array to match exact structure
      const classDetailsArray = classDetailsData.map((classItem) => ({
        title: classItem.className,
        subCategoryID: parseInt(classItem.subCategory) || 0,
        categoryID: parseInt(classItem.category) || 0,
        timingsFrom: classItem.timingsFrom,
        timingsTo: classItem.timingsTo ,
        day: Array.isArray(classItem.weekdays) ? classItem.weekdays.join(',') : '',
        type: classItem.type || 'Offline',
        ageFrom: classItem.fromage ? parseInt(classItem.fromage) : 0,
        ageTo: classItem.toage ? parseInt(classItem.toage) : 0,
        sessionFrom: 1,
        sessionTo: classItem.noOfSessions ? parseInt(classItem.noOfSessions) : 1,
        gender: classItem.gender || 'both',
        fromPrice: classItem.fromcost ? parseFloat(classItem.fromcost) : 0,
        toPrice: classItem.tocost ? parseFloat(classItem.tocost) : 0
      }));

      // Format course details array to match exact structure
      const courseDetailsArray = courseDetailsData.map((course) => ({
        title: course.className,
        subCategoryID: parseInt(course.subCategory) || 0,
        categoryID: parseInt(course.category) || 0,
        timingsFrom: course.time === 'morning' ? '09:00' :
          course.time === 'afternoon' ? '13:00' :
            course.time === 'evening' ? '17:00' : '09:00',
        timingsTo: course.time === 'morning' ? '12:00' :
          course.time === 'afternoon' ? '16:00' :
            course.time === 'evening' ? '20:00' : '12:00',
        day: Array.isArray(course.weekdays) ? course.weekdays.join(',') : 'monday',
        type: course.type || 'Offline',
        ageFrom: course.fromage ? parseInt(course.fromage) : 0,
        ageTo: course.toage ? parseInt(course.toage) : 0,
        sessionFrom: 1,
        sessionTo: course.noOfSessions ? parseInt(course.noOfSessions) : 1,
        gender: course.gender || 'both',
        fromPrice: course.fromcost ? parseFloat(course.fromcost) : 0,
        toPrice: course.tocost ? parseFloat(course.tocost) : 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));

      // Add class and course details without extra quotes and escaping
      formData.append('activity.classDetails', JSON.stringify(classDetailsArray));
      formData.append('activity.courseDetails', JSON.stringify(courseDetailsArray));
      formData.append('activity.id', '0');

      try {
        const response = await registerVendor(formData);

        if (response) {
          setUsername(response.username);
          setIsSuccessPopupOpen(true);
          toast.success("Registration completed successfully!");
        }
      } catch (error: any) {
        // Handle API error response
        const errorMessage = error.message || "An error occurred while submitting the form. Please try again.";
        toast.error(errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsLoading(false);
      setIsPreviewOpen(false); // Close the preview popup
    }
  };
  const handleWeekdayChange = (day: string, isClassfields: boolean) => {
    const currentWeekdays = isClassfields ? watchClass('weekdays') || [] : watchCourse('weekdays') || []; // Get current weekdays value

    // If day is already selected, remove it; otherwise, add it
    if (isClassfields) {
      if (currentWeekdays.includes(day)) {
        setValueClass('weekdays', currentWeekdays.filter((d: any) => d !== null && d !== day));
      } else {
        setValueClass('weekdays', [...currentWeekdays.filter((d: any) => d !== null), day]);
      }
    } else {
      if (currentWeekdays.includes(day)) {
        setValueCourse('weekdays', currentWeekdays.filter((d: any) => d !== null && d !== day));
      } else {
        setValueCourse('weekdays', [...currentWeekdays.filter((d: any) => d !== null), day]);
      }
    }
  };

  const handleEditClass = (index: number) => {
    setEditIndex(index);
    const classToEdit = classDetailsData[index];
    Object.keys(classToEdit).forEach((key) => {
      setValueClass(key as keyof typeof classDetailsSchema.fields, classToEdit[key]);
    });
    setShowClassFields(true);
    setActiveAccordion("item-4");
  };

  const handleEditCourse = (index: number) => {
    setEditIndex(index);
    const courseToEdit = courseDetailsData[index];
    Object.keys(courseToEdit).forEach((key) => {
      setValueCourse(key as keyof typeof courseDetailsSchema.fields, courseToEdit[key]);
    });
    setShowCourseFields(true);
    setActiveAccordion("item-5");
  };

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category.title.toString() === watchCourse("category")
    );

    if (selectedCategory && selectedCategory.subcategories.length > 0) {
      setValueCourse("subCategory", selectedCategory.subcategories[0].id.toString());
    } else {
      setValueCourse("subCategory", "");
    }
  }, [watchCourse, categories, setValueCourse]);

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category.title.toString() === watchClass("category")
    );

    if (selectedCategory && selectedCategory.subcategories.length > 0) {
      setValueClass("subCategory", selectedCategory.subcategories[0].id.toString());
    } else {
      setValueClass("subCategory", "");
    }
  }, [watchClass, categories, setValueClass]);

  const onAccordianClick = (value: string) => {
    console.log("Accordion value changed:", value);
    
    // Allow opening if the section is already active
    if (value === activeAccordion) {
      setActiveAccordion(""); // Close the accordion
      return;
    }

    // Check if the section can be opened based on completed sections
    if (
      (value === "item-0") || // Personal Details can always be opened
      (value === "item-1" && completedSections.personalDetails) || // Institute Details depends on Personal Details
      (value === "item-2" && completedSections.instituteDetails) || // Institute Images depends on Institute Details
      (value === "item-4" && completedSections.instituteDetails) || // Class Details depends on Institute Details
      (value === "item-5" && completedSections.instituteDetails) // Course Details depends on Institute Details
    ) {
      setActiveAccordion(value); // Allow opening the accordion
    } else {
      toast.error("Please complete the previous sections first!"); // Show an error message
    }
  }

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValueInstitute("thumbnailImageFile", file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleClearForm = () => {
    // Clear personal details
    personalForm.reset();
    setPersonalDetailsData(null);
    
    // Clear institute details
    instituteForm.reset();
    setInstituteDetailsData(null);
    
    // Clear class and course details
    setClassDetailsData([]);
    setCourseDetailsData([]);
    
    // Clear images
    setImages([]);
    setImageUrls([]);
    setThumbnailPreview(null);
    
    // Reset completion states
    setCompletedSections({
      personalDetails: false,
      instituteDetails: false,
      classDetails: false
    });
    
    // Reset active accordion
    setActiveAccordion("item-0");
  };

  return (
    <>
      <div className="mx-auto p-6">
        <h2 className="text-[#05244f] text-[30px] font-medium text-center font-['Minion_Pro']">Registration Form</h2>
        <p className="text-center text-[#a3a4a4] text-[14.90px] font-bold trajan-pro py-3">
          Add details about your Institute with high-quality photos and class details
          <span className="text-red-500 text-sm mt-1 float-right">* Required Fields</span>
        </p>

        <Accordion
          type="single"
          value={activeAccordion}
          collapsible
        >
          {/* Personal Details Section */}
          <AccordionItem value="item-0">
            <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-2 px-8 mb-3">
              <AccordionTrigger onClick={() => onAccordianClick("item-0")}>
                <div className={`text-[#05244f] text-md trajan-pro font-bold mb-2 flex items-center ${completedSections.personalDetails || activeAccordion == 'item-0' ? "accordian-trigger-active" : "accordian-trigger-inactive"}`}>
                  Personal Details
                  {completedSections.personalDetails && <CircleCheckBig className="text-[#46a758] ml-2" />}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form onSubmit={handleSubmitPersonal(savePersonalDetails)}>
                  <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Full Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Full Name"
                        {...registerPersonal("name")}
                        className="h-[52px] border-[#05244f]"
                      />
                      {errorsPersonal.name && (
                        <p className="text-red-500 text-xs">{errorsPersonal.name.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Mobile<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Mobile"
                        maxLength={10}
                        {...registerPersonal("phoneNumber")}
                        className="h-[52px] border-[#05244f]"
                      />
                      {errorsPersonal.phoneNumber && (
                        <p className="text-red-500 text-xs">{errorsPersonal.phoneNumber.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Email<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Email"
                        {...registerPersonal("emailId")}
                        className="h-[52px] border-[#05244f]"
                      />
                      {errorsPersonal.emailId && (
                        <p className="text-red-500 text-xs">{errorsPersonal.emailId.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Gender<span className="text-red-500">*</span>
                      </Label>
                      <Select
                        onValueChange={(value) => setValuePersonal("gender", value)}
                        defaultValue={watchPersonal("gender")}
                      >
                        <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Trans">Trans</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      {errorsPersonal.gender && (
                        <p className="text-red-500 text-xs">{errorsPersonal.gender.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Date of Birth<span ></span>
                      </Label>
                      <Input
                        type="date"
                        {...registerPersonal("dob", {
                          setValueAs: (value) => value === '' ? null : value
                        })}
                        className="h-[52px] border-[#05244f]"
                      />
                      {/* {errorsPersonal.dob && (
                        <p className="text-red-500 text-xs">{errorsPersonal.dob.message}</p>
                      )} */}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Profile Image
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValuePersonal("profileImageFile", file);
                          }
                        }}
                        className="h-[52px] border-[#05244f]"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="my-4 w-20% app-bg-color text-white float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </form>
              </AccordionContent>
            </div>
          </AccordionItem>

          {/* Institute Details Section */}
          <AccordionItem value="item-1">
            <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-2 px-8 mb-3">
              <AccordionTrigger onClick={() => onAccordianClick("item-1")}>
                <div className={` text-md trajan-pro font-bold mb-2 flex items-center ${completedSections.instituteDetails || activeAccordion == 'item-1' ? "accordian-trigger-active" : "accordian-trigger-inactive"} "`}>
                  Institute Details
                  {completedSections.instituteDetails && <CircleCheckBig className="text-[#46a758] ml-2" />}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form>
                  <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Program Title<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Program Title"
                        {...registerInstitute("programTitle")}
                        className={`h-[52px] border-[#05244f] ${errorsInstitute.programTitle ? 'border-red-500' : ''}`}
                      />
                      {errorsInstitute.programTitle && (
                        <p className="text-red-500 text-xs">{errorsInstitute.programTitle.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Institute Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Institute Name"
                        {...registerInstitute("instituteName")}
                        className={`h-[52px] border-[#05244f] ${errorsInstitute.instituteName ? 'border-red-500' : ''}`}
                      />
                      {errorsInstitute.instituteName && (
                        <p className="text-red-500 text-xs">{errorsInstitute.instituteName.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Since</Label>
                      <Input
                        placeholder="Since"
                        {...registerInstitute("since")}
                        className="h-[52px] border-[#05244f]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">GST No</Label>
                      <Input
                        placeholder="GST No."
                        {...registerInstitute("gstNo")}
                        className="h-[52px] border-[#05244f]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                      Thumbnail Image<span className="text-red-500">*</span>
                    </Label>
                    
                    {thumbnailPreview && (
                      <div className="relative w-[158px] h-[158px] mb-4">
                        <Image
                          src={thumbnailPreview}
                          alt="Thumbnail Preview"
                          width={158}
                          height={158}
                          className="rounded-md w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setThumbnailPreview(null);
                            if (thumbnailInputRef.current) {
                              thumbnailInputRef.current.value = '';
                            }
                            setValueInstitute("thumbnailImageFile", new File([], ''));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    )}

                    <div
                      className="h-[180px] flex flex-col gap-3 justify-center items-center py-4 my-3 rounded-[15px] border border-dashed border-[#05244f] cursor-pointer p-4"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <div className="flex justify-center">
                        <Image src={"/Icons/file-upload.svg"} alt="file-upload" height={45} width={59} />
                      </div>
                      <div className="text-center text-[#acacac] trajan-pro text-[11.6px] font-medium">
                        Drag your file(s) to start uploading
                      </div>
                      <div>
                        <Button variant="outline" type="button" className="">Browse File</Button>
                      </div>
                      <input
                        type="file"
                        onChange={handleThumbnailUpload}
                        ref={thumbnailInputRef}
                        className="hidden"
                        accept="image/jpeg,image/png,image/avif,.jpg,.jpeg,.png,.avif"
                      />
                    </div>
                    <div className="relative justify-center text-[#cecece] text-[11.6px] font-medium">
                      Only support jpg, png and avif files
                    </div>
                    {errorsInstitute.thumbnailImageFile && (
                      <p className="text-red-500 text-xs">{errorsInstitute.thumbnailImageFile.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mb-6">
                    <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                      Introduction<span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      placeholder="Introduction"
                      rows={5}
                      {...registerInstitute("introduction")}
                      className={`rounded-[15px] h-[120px] border-[#05244f] ${errorsInstitute.introduction ? 'border-red-500' : ''}`}
                    />
                    {errorsInstitute.introduction && (
                      <p className="text-red-500 text-xs">{errorsInstitute.introduction.message}</p>
                    )}
                  </div>

                  {/* Contact Details Section */}
                  <div className="mt-8">
                    <h3 className="text-[#05244f] text-lg font-semibold mb-4">Contact Details</h3>
                    <div className="border border-[#05244f] rounded-md p-4">
                      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            First Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="First Name"
                            {...registerInstitute("firstName")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.firstName && (
                            <p className="text-red-500 text-xs">{errorsInstitute.firstName.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Last Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Last Name"
                            {...registerInstitute("lastName")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.lastName && (
                            <p className="text-red-500 text-xs">{errorsInstitute.lastName.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Enter Phone No."
                            maxLength={10}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            {...registerInstitute("phoneNumber")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.phoneNumber && (
                            <p className="text-red-500 text-xs">{errorsInstitute.phoneNumber.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            WhatsApp Number
                          </Label>
                          <Input
                            placeholder="Enter WhatsApp Number"
                            maxLength={10}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            {...registerInstitute("whatsappNumber")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.whatsappNumber && (
                            <p className="text-red-500 text-xs">{errorsInstitute.whatsappNumber.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Email Address"
                            {...registerInstitute("email")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.email && (
                            <p className="text-red-500 text-xs">{errorsInstitute.email.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Experience
                          </Label>
                          <Input
                            placeholder="Enter in years"
                            {...registerInstitute("experience")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Certifications
                          </Label>
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setValueInstitute("certifications", file);
                              }
                            }}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Contact Introduction
                        </Label>
                        <Textarea
                          placeholder="Contact Introduction"
                          rows={8}
                          {...registerInstitute("contactIntroduction")}
                          className="border-[#05244f] h-[90px]"
                        />
                      </div>

                      <div className="mb-6">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Contact Type
                        </Label>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="primary"
                              className="border-black"
                              {...registerInstitute("contactType.primary")}
                            />
                            <Label htmlFor="primary">Primary</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="secondary"
                              className="border-black"
                              {...registerInstitute("contactType.secondary")}
                            />
                            <Label htmlFor="secondary">Secondary</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="billing"
                              className="border-black"
                              {...registerInstitute("contactType.billing")}
                            />
                            <Label htmlFor="billing">Billing</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Details Section */}
                  <div className="mt-8">
                    <h3 className="text-[#05244f] text-lg font-semibold mb-4">Location Details</h3>
                    <div className="border border-[#05244f] rounded-md p-4">
                      <h3 className="text-[#05244f] trajan-pro text-md font-semibold mb-4">Location Details</h3>

                      {/* Location Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Address<span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Address"
                            {...registerInstitute("address")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.address && (
                            <p className="text-red-500 text-xs">{errorsInstitute.address.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Landmark <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Near by landmark"
                            {...registerInstitute("landmark")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.landmark && (
                            <p className="text-red-500 text-xs">{errorsInstitute.landmark.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Area <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="Area"
                            {...registerInstitute("area")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.area && (
                            <p className="text-red-500 text-xs">{errorsInstitute.area.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            City <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="City"
                            {...registerInstitute("city")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.city && (
                            <p className="text-red-500 text-xs">{errorsInstitute.city.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">State</Label>
                          <Input
                            placeholder="State"
                            {...registerInstitute("state")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Country</Label>
                          <Input
                            placeholder="Country"
                            {...registerInstitute("country")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Pincode</Label>
                          <Input
                            placeholder="Pincode"
                            {...registerInstitute("pincode")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Latitude</Label>
                          <Input
                            placeholder="Latitude"
                            {...registerInstitute("latitude")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Longitude</Label>
                          <Input
                            placeholder="Longitude"
                            {...registerInstitute("longitude")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-[#05244f] text-lg font-semibold mb-4">Additional Information</h3>
                    <div className="border border-[#05244f] rounded-md p-4">
                      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Website Name</Label>
                          <Input
                            placeholder="Website Name"
                            {...registerInstitute("websiteName")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Class Level</Label>
                          <Input
                            placeholder="Class Level"
                            {...registerInstitute("classLevel")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Instagram Account</Label>
                          <Input
                            placeholder="Instagram Account"
                            {...registerInstitute("instagramAccount")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">YouTube Account</Label>
                          <Input
                            placeholder="YouTube Account"
                            {...registerInstitute("youtubeAccount")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        
                      </div>
                      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 my-4 mb-6">
                        {/* <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Road
                          </Label>
                          <Input
                            placeholder="Road"
                            {...registerInstitute("road")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Purchase Material IDs
                          </Label>
                          <Input
                            placeholder="Purchase Material IDs"
                            {...registerInstitute("purchaseMaterialIds")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Item Carry Text
                          </Label>
                          <Input
                            placeholder="Item Carry Text"
                            {...registerInstitute("itemCarryText")}
                            className="h-[52px] border-[#05244f]"
                          />
                        </div> */}
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                            Category<span className="text-red-500">*</span>
                          </Label>
                          <Select
                            onValueChange={(value) => setValueInstitute("categoryId", parseInt(value))}
                            value={watchInstitute("categoryId")?.toString() || ""}
                          >
                            <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errorsInstitute.categoryId && (
                            <p className="text-red-500 text-xs">{errorsInstitute.categoryId.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                

                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={() => setActiveAccordion("item-0")}
                      className="border-[#05244f] text-[#05244f] mr-2"
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={saveInstituteDetails}
                      className="w-20% app-bg-color text-white float-right"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </AccordionContent>
            </div>
          </AccordionItem>

          {/* Institute Images Section */}
          <AccordionItem value="item-2">
            <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-2 px-8 mb-3">
              <AccordionTrigger onClick={() => onAccordianClick("item-2")}>
                <div className={`text-[#05244f] text-md trajan-pro font-bold mb-2 flex items-center ${completedSections.instituteDetails || activeAccordion == 'item-2' ? "accordian-trigger-active" : "accordian-trigger-inactive"}`}>
                  Institute Images
                  {completedSections.instituteDetails && <CircleCheckBig className="text-[#46a758] ml-2" />}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mb-6">
                  <h3 className="text-[#05244f] trajan-pro text-md font-semibold mb-4">Upload Institute Images</h3>
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4 rounded-[10px]">
                      {imageUrls.map((src, index) => (
                        <div key={index} className="relative w-[158px] h-[158px]">
                          <Image
                            src={src}
                            alt="Uploaded"
                            width={158}
                            height={158}
                            className="rounded-md w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedImages = images.filter((_, i) => i !== index);
                              const updatedUrls = imageUrls.filter((_, i) => i !== index);
                              setImages(updatedImages);
                              setImageUrls(updatedUrls);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className="h-[180px] flex flex-col gap-3 justify-center items-center py-4 my-3 rounded-[15px] border border-dashed border-[#05244f] cursor-pointer p-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex justify-center">
                      <Image src={"/Icons/file-upload.svg"} alt="file-upload" height={45} width={59} />
                    </div>
                    <div className="text-center text-[#acacac] trajan-pro text-[11.6px] font-medium">
                      Drag your file(s) to start uploading
                    </div>
                    <div>
                      <Button variant="outline" type="button" className="">Browse File</Button>
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/avif,.jpg,.jpeg,.png,.avif"
                    />
                  </div>
                  <div className="relative justify-center text-[#cecece] text-[11.6px] font-medium">
                    Only support jpg, png and avif files
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    onClick={() => setActiveAccordion("item-1")}
                    className="border-[#05244f] text-[#05244f] mr-2"
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => {
                      if (images.length === 0) {
                        toast.error("Please select at least one image");
                        return;
                      }
                      setCompletedSections(prev => ({ ...prev, instituteDetails: true }));
                      setActiveAccordion("");
                      toast.success("Images saved successfully!");
                    }}
                    className="app-bg-color text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Images"}
                  </Button>
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>

          {/* Class Details Button */}
          {/* <Button
            variant="outline"
            className="border-[#05244f] mt-4"
            onClick={() => setIsOpen(true)}
          >
            + Add Class Details
          </Button> */}

          <PopupScreen
            open={isOpen}
            setOpen={setIsOpen}
            setShowClassFields={setShowClassFields}
            setShowCourseFields={setShowCourseFields}
            setAccordianOpen={setActiveAccordion}
          />

          {/* Class Details Section */}
          {showClassFields && (
            <AccordionItem value="item-4">
              <div className="bg-white rounded-[15px] border border-[#05244f] py-2 px-8 my-4">
                <AccordionTrigger>
                  <div className="text-[#05244f] text-md font-bold my-4 trajan-pro flex items-center">
                    Class Details
                    {completedSections.classDetails && <CircleCheckBig className="text-[#46a758] ml-2" />}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <form onSubmit={handleSubmitClass(saveClassDetails)}>
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Class Name<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="Class Name"
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
                            {Array.from(new Set(categories.map(item => item.title))).map((title, index) => (
                              <SelectItem key={index} value={title}>{title}</SelectItem>
                            ))}
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

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                      { }
                      { }
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">No. of Sessions</Label>
                        <Input type="number" {...registerClass("noOfSessions")} min="1" defaultValue="1" placeholder="Enter number of sessions" className="h-[52px] border-[#05244f]" />
                      </div>
                      <CostRangeInput
                        form={classForm as UseFormReturn<FormValues>}
                        setValue={setValueClass}
                        errors={errorsClass}
                      />



                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Time<span className="text-red-500">*</span>
                        </Label>
                        <TimeRangeInput form={classForm as UseFormReturn<FormValues>}
                          setValue={setValueClass}
                          errors={errorsClass}/>
                        {errorsClass.time && (
                          <p className="text-red-500 text-xs">{errorsClass.time.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Class Type<span className="text-red-500">*</span>
                        </Label>
                        <Select 
                          onValueChange={(value: 'Regular' | 'Online' | 'Offline') => setValueClass("type", value)} 
                          value={watchClass("type") || "Offline"}
                        >
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Select Class Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Offline">Offline</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="Regular">Regular</SelectItem>
                          </SelectContent>
                        </Select>
                        {errorsClass.type && (
                          <p className="text-red-500 text-xs">{errorsClass.type.message}</p>
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
                              onChange={() => handleWeekdayChange(day, true)}
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
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="Trans">Trans</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <AgeRangeInput
                          form={classForm as UseFormReturn<FormValues>}
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
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Class Details"}
                    </Button>
                  </form>
                </AccordionContent>
              </div>
            </AccordionItem>
          )}

          {/* Class Details Section */}
          {showCourseFields && (
            <AccordionItem value="item-5">
              <div className="bg-white rounded-[15px] border border-[#05244f] py-2 px-8 my-4">
                <AccordionTrigger>
                  <div className="text-[#05244f] text-md font-bold my-4 trajan-pro flex items-center">
                    Course Details
                    {completedSections.classDetails && <CircleCheckBig className="text-[#46a758] ml-2" />}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <form onSubmit={handleSubmitCourse(handleCourseSubmit)}>
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Course Name<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="Course Name"
                          {...registerCourse("className")}
                          className="h-[52px] border-[#05244f]"
                        />
                        {errorsCourse.className && (
                          <p className="text-red-500 text-xs">{errorsCourse.className.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Category<span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(value) => setValueCourse("category", value)} value={watchCourse("category") || ""}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories!.map((item) => (<SelectItem key={item.id} value={item.title.toString()}>{item.title}</SelectItem>))}
                          </SelectContent>
                        </Select>
                        {errorsCourse.category && (
                          <p className="text-red-500 text-xs">{errorsCourse.category.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">Sub Category</Label>
                        <Select
                          onValueChange={(value) => setValueCourse("subCategory", value)}
                          value={watchCourse("subCategory") || ""}
                        >
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Sub Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find((category) => category.title.toString() === watchCourse("category"))?.subcategories.map((subCategory) => (
                                <SelectItem key={subCategory.id} value={subCategory.id.toString()}>
                                  {subCategory.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                      <AgeRangeInput
                        form={courseForm as UseFormReturn<FormValues>}
                        setValue={setValueCourse}
                        errors={errorsCourse}
                      />
                      <CostRangeInput
                        form={courseForm as UseFormReturn<FormValues>}
                        setValue={setValueCourse}
                        errors={errorsCourse}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">No. of Sessions</Label>
                        <Input type="number" {...registerCourse("noOfSessions")} min="1" defaultValue="1" placeholder="Enter number of sessions" className="h-[52px] border-[#05244f]" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Time<span className="text-red-500">*</span>
                        </Label>
                        {/* <Select onValueChange={(value) => setValueCourse("time", value)} value={watchCourse("time") || ""}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                          </SelectContent>
                        </Select> */}
                        <TimeRangeInput form={courseForm as UseFormReturn<FormValues>}
                          setValue={setValueCourse}
                          errors={errorsCourse}/>
                        {errorsCourse.time && (
                          <p className="text-red-500 text-xs">{errorsCourse.time.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2 border border-[#05244f] rounded-md mb-6">
                      {[
                        'Monday', 'Tuesday', 'Wednesday',
                        'Thursday', 'Friday', 'Saturday', 'Sunday'
                      ].map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`course-${day.toLowerCase()}`}
                            className="h-4 w-4 border-[#05244f]"
                            onChange={() => handleWeekdayChange(day, false)}
                            checked={(watchCourse('weekdays') || []).includes(day)}
                          />
                          <label htmlFor={`course-${day.toLowerCase()}`} className="text-sm">{day}</label>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-2 p-2 border border-[#05244f] rounded-md">
                      <div className="text-[#05244f] text-md font-bold my-4 trajan-pro flex items-center">
                        Course criteria
                      </div>
                      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Gender</Label>
                          <Select value={watchCourse("gender") || ""} onValueChange={(value) => setValueCourse("gender", value)}>
                            <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                              <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="Trans">Trans</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* <AgeRangeInput
                          form={classForm as UseFormReturn<FormValues>}
                          setValue={setValueClass}
                          errors={errorsClass}
                        /> */}

                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Prior Knowledge</Label>
                          <Select value={watchClass("experienceLevel") || ""} onValueChange={(value) => setValueCourse("experienceLevel", value)}>
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
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Course Details"}
                    </Button>
                  </form>
                </AccordionContent>
              </div>
            </AccordionItem>
          )}
        </Accordion>

        {/* Add Class/Course Tables */}
        <div className="mt-8">
          {classDetailsData.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[#05244f] text-lg font-semibold mb-4">Classes</h3>
              <ClassCourseTable
                items={classDetailsData}
                type="class"
                onEdit={handleEditClass}
                onDelete={handleDeleteClass}
              />
            </div>
          )}

          {courseDetailsData.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[#05244f] text-lg font-semibold mb-4">Courses</h3>
              <ClassCourseTable
                items={courseDetailsData}
                type="course"
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            </div>
          )}
        </div>

        {/* Add Class/Course Button */}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            className="border-[#05244f]"
            onClick={() => setIsOpen(true)}
          >
            + Add {classDetailsData.length > 0 || courseDetailsData.length > 0 ? 'More' : ''} Class/Course
          </Button>
        </div>

        {/* Final Submit Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleFinalSubmit}
            className="app-bg-color text-white px-8 py-6 text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Registration"}
          </Button>
        </div>

        {/* Class Details Section */}
        {courses.length > 0 && <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-4 px-8 my-4">
          <div className="text-[#05244f] text-md trajan-pro font-bold my-4">Classes</div>
          <div className="bg-[#fcfcfd] rounded-[15px] outline-1 outline-offset-[-1px] p-4 outline-black">
            <ClassTable classes={courses} handleDelete={handleDeleteClass} handleEdit={handleEditClass} />
          </div>
        </div>
        }

        {/* Directory Section */}
        {directory.length > 0 && <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-4 px-8 my-4">
          <div className="text-[#05244f] text-md trajan-pro font-bold my-4">Directory</div>
          <div className="bg-[#fcfcfd] rounded-[15px] outline-1 outline-offset-[-1px] p-4 outline-black">
            <DirectoryTable
              directory={directory}
              handleDelete={(index) => {
                const updatedDirectory = directory.filter((_, i) => i !== index);
                setDirectory(updatedDirectory);
              }}

            />
          </div>

        </div>
        }
              {/* Preview Popup */}
      <PreviewPopup
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        personalDetails={personalDetailsData}
        instituteDetails={instituteDetailsData}
        classDetails={classDetailsData}
        courseDetails={courseDetailsData}
        images={images}
        onSubmit={handleSubmitAfterPreview}
      />
        {/* Success Popup */}
        <SuccessPopupScreen
          open={isSuccessPopupOpen}
          setOpen={setIsSuccessPopupOpen}
          username={username}
          onClose={handleClearForm}
        />

        <DeletePopupScreen 
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          onDelete={() => {
            if (onDeleteCallback) {
              onDeleteCallback();
            }
          }}
          message={deleteMessage}
        />
      </div>
    </>
  );
}