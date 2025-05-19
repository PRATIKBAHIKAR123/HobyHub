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
import { getAllSubCategories, getAllCategories } from "@/services/hobbyService";
import { DirectoryItem } from "./directoryList";
import CostRangeInput from "./costRangeInput";
import AgeRangeInput from "./ageRangeInput";
import ClassCourseTable from "./classCourseTable";
import DeletePopupScreen from "@/app/components/DeletePopupScreen";
import PreviewPopup from "./preview";
import TimeRangeInput from "./timeRangeInput";
import SessionRangeInput from "./sessionRangeInput";
import LocationPopupScreen from "./locationSelection";
import ContactPopupScreen from "./contactSelection";
import { FormValues, Location, Contact, Category } from "./types";
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Personal details form schema
const personalDetailsSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  emailId: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  dob: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .test(
      'is-16-or-older',
      'Age must be 16 years or older',
      function (value) {
        if (!value) return true; // skip validation if not provided

        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (age > 16) return true;
        if (age === 16) {
          if (monthDiff > 0) return true;
          if (monthDiff === 0 && dayDiff >= 0) return true;
        }

        return false;
      }
    ),

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
  websiteName: yup.string(),
  classLevel: yup.string(),
  instagramAccount: yup.string(),
  youtubeAccount: yup.string(),
  // categoryId: yup.number(),
  // purchaseMaterialIds: yup.string(),
  // itemCarryText: yup.string()
});

// Class details form schema
const classDetailsSchema = yup.object().shape({
  type: yup.string().required('Type is required'),
  className: yup.string().required('Class name is required'),
  category: yup.string().required('Category is required'),
  subCategory: yup.string().required('Sub-category is required'),
  time: yup.string(),
  timingsFrom: yup.string(),
  timingsTo: yup.string(),
  weekdays: yup.array().of(yup.string()),
  fromage: yup.string(),
  toage: yup.string(),
  fromcost: yup.string(),
  tocost: yup.string(),
  gender: yup.string(),
  experienceLevel: yup.string(),
  noOfSessions: yup.string(),
  location: yup.object().nullable(),
  contact: yup.object().nullable()
});

// Course details form schema
const courseDetailsSchema = yup.object().shape({
  type: yup.string().required('Type is required'),
  className: yup.string().required('Course name is required'),
  category: yup.string().required('Category is required'),
  subCategory: yup.string().required('Sub-category is required'),
  time: yup.string(),
  timingsFrom: yup.string(),
  timingsTo: yup.string(),
  weekdays: yup.array().of(yup.string()),
  fromage: yup.string(),
  toage: yup.string(),
  fromcost: yup.string(),
  tocost: yup.string(),
  gender: yup.string(),
  experienceLevel: yup.string(),
  noOfSessions: yup.string(),
  location: yup.object().nullable(),
  contact: yup.object().nullable()
});

export default function RegistrationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [directory, setDirectory] = useState<DirectoryItem[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [onDeleteCallback, setOnDeleteCallback] = useState<(() => void) | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [showClassFields, setShowClassFields] = useState(false);
  const [showCourseFields, setShowCourseFields] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("item-0");
  const [isLoading, setIsLoading] = useState(false);
  const [completedSections, setCompletedSections] = useState({
    personalDetails: false,
    instituteDetails: false,
    classDetails: false
  });
  const [classDetailsData, setClassDetailsData] = useState<any[]>([]);
  const [courseDetailsData, setCourseDetailsData] = useState<any[]>([]);
  const [personalDetailsData, setPersonalDetailsData] = useState<any>(null);
  const [instituteDetailsData, setInstituteDetailsData] = useState<any>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Add back the contacts state
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      tutorFirstName: 'Ajay',
      tutorLastName: 'Kumar',
      tutorEmailID: 'ajay@example.com',
      tutorCountryCode: '+91',
      tutorPhoneNo: '9876543210',
      whatsappCountryCode: '+91',
      whatsappNo: '9876543210',
      tutorIntro: 'Experienced tutor',
      contactType: { primary: true, secondary: false, billing: false }
    },
    {
      id: '2',
      tutorFirstName: 'Priya',
      tutorLastName: 'Singh',
      tutorEmailID: 'priya@example.com',
      tutorCountryCode: '+91',
      tutorPhoneNo: '9876543211',
      whatsappCountryCode: '+91',
      whatsappNo: '9876543211',
      tutorIntro: 'Professional instructor',
      contactType: { primary: false, secondary: true, billing: false }
    },
    {
      id: '3',
      tutorFirstName: 'Raj',
      tutorLastName: 'Sharma',
      tutorEmailID: 'raj@example.com',
      tutorCountryCode: '+91',
      tutorPhoneNo: '9876543212',
      whatsappCountryCode: '+91',
      whatsappNo: '9876543212',
      tutorIntro: 'Senior trainer',
      contactType: { primary: false, secondary: false, billing: true }
    }
  ]);

  // const router = useRouter();

  // Remove unused state variables
  // const [editIndex, setEditIndex] = useState<number | null>(null);

  // Add default location
  const defaultLocation: Location = {
    id: 'default',
    address: "Pune, Maharashtra",
    area: "Pune",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    pincode: "411001",
    latitude: "18.5204",
    longitude: "73.8567",
    road: "Main Road"
  };

  // Remove duplicate state declarations
  // const [locationData, setLocationData] = useState<Location | null>(null);
  // const [contactData, setContactData] = useState<Contact | null>(null);

  // Add default contact
  // const defaultContact: Contact = {
  //   id: '1',
  //   firstName: 'Default',
  //   tutorLastName: 'Contact',
  //   phoneNumber: '+919876543210',
  //   email: 'default@example.com',
  //   contactType: { primary: true, secondary: false, billing: false }
  // };

  // Add currentFormType state
  const [currentFormType] = useState<'class' | 'course'>('class');

  // Remove the savedLocations state and related localStorage code
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [savedContacts, setSavedContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (showClassFields) {
      setActiveAccordion("item-4"); // Open the class accordion
      setShowCourseFields(false); // Close the course form
    }
  }, [showClassFields]);

  useEffect(() => {
    if (showCourseFields) {
      setActiveAccordion("item-5"); // Open the course accordion
      setShowClassFields(false); // Close the class form
    }
  }, [showCourseFields]);

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
      websiteName: '',
      classLevel: '',
      instagramAccount: '',
      youtubeAccount: '',
      // categoryId: undefined,
      // purchaseMaterialIds: '',
      // itemCarryText: ''
    }
  });

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

  // Form for course details
  const courseForm = useForm<FormValues>({
    resolver: yupResolver(courseDetailsSchema) as any,
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
    formState: { errors: errorsClass }
  } = classForm;

  const {
    register: registerCourse,
    handleSubmit: handleSubmitCourse,
    setValue: setValueCourse,
    watch: watchCourse,
    formState: { errors: errorsCourse }
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
    try {
      // Validate the form
      const isValid = await classForm.trigger();
      if (!isValid) {
        toast.error("Please fill in all required fields");
        return;
      }
      debugger;
      const classDetails = {
        ...data,
        location: data.location || defaultLocation,
        contact: data.contact || null,
        id: Date.now(), // Add unique ID for each class
        type: data.type || 'Offline',
        gender: data.gender || 'both',
        experienceLevel: data.experienceLevel || 'beginner',
        noOfSessions: data.noOfSessions || '1'
      };

      setClassDetailsData(prev => [...prev, classDetails]);
      classForm.reset();
      toast.success('Class details saved successfully');
      setShowClassFields(false); // Hide the form after saving
    } catch (error) {
      console.error('Error saving class details:', error);
      toast.error('Failed to save class details');
    }
  };

  // Update the handleCourseSubmit function
  const handleCourseSubmit = async () => {
    try {
      // Validate the form
      const isValid = await courseForm.trigger();
      if (!isValid) {
        toast.error("Please fill in all required fields");
        return;
      }

      const data = watchCourse();
      const courseDetails = {
        ...data,
        location: data.location || defaultLocation,
        contact: data.contact || null,
        id: Date.now(), // Add unique ID for each course
        type: data.type || 'Offline',
        gender: data.gender || 'both',
        experienceLevel: data.experienceLevel || 'beginner',
        noOfSessions: data.noOfSessions || '1'
      };

      setCourseDetailsData(prev => [...prev, courseDetails]);
      courseForm.reset();
      toast.success('Course details saved successfully');
      setShowCourseFields(false);
    } catch (error) {
      console.error('Error saving course details:', error);
      toast.error('Failed to save course details');
    }
  };

  // Update the handleFinalSubmit function
  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Add personal details
      if (personalDetailsData) {
        formData.append('name', personalDetailsData.firstName + ' ' + personalDetailsData.lastName);
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

      // Add institute details
      if (instituteDetailsData) {
        formData.append('activity.type', 'INSTITUTE');
        formData.append('activity.title', instituteDetailsData.programTitle);
        formData.append('activity.companyName', instituteDetailsData.instituteName);
        formData.append('activity.description', instituteDetailsData.introduction || '');
        formData.append('activity.sinceYear', instituteDetailsData.since || '');
        formData.append('activity.gstNo', instituteDetailsData.gstNo || '');

        // Add thumbnail image
        if (selectedThumbnailIndex !== null && images[selectedThumbnailIndex]) {
          formData.append('activity.thumbnailImageFile', images[selectedThumbnailIndex]);
        }

        // Add other images
        images.forEach((image, index) => {
          if (index !== selectedThumbnailIndex) {
            formData.append('activity.images', image);
          }
        });

        // Add additional information
        formData.append('activity.website', instituteDetailsData.websiteName || '');
        formData.append('activity.classLevel', instituteDetailsData.classLevel || '');
        formData.append('activity.instagramAcc', instituteDetailsData.instagramAccount || '');
        formData.append('activity.youtubeAcc', instituteDetailsData.youtubeAccount || '');
      }

      // Format class details array with location and contact
      const classDetailsArray = classDetailsData.map((classItem) => ({
        title: classItem.className,
        subCategoryID: classItem.subCategory || '0',
        categoryID: classItem.category || '0',
        timingsFrom: classItem.timingsFrom || '09:00',
        timingsTo: classItem.timingsTo || '12:00',
        day: Array.isArray(classItem.weekdays) ? classItem.weekdays.join(',') : 'monday',
        type: classItem.type || 'Offline',
        ageFrom: parseInt(classItem.fromage) || 0,
        ageTo: parseInt(classItem.toage) || 0,
        sessionFrom: parseInt(classItem.sessionFrom) || 0,
        sessionTo: parseInt(classItem.sessionTo) || 1,
        gender: classItem.gender || 'both',
        fromPrice: parseFloat(classItem.fromcost) || 0,
        toPrice: parseFloat(classItem.tocost) || 0,
        id: 0,
        activityId: 0,
        address: classItem.location?.address,
        area: classItem.location?.area,
        city: classItem.location?.city,
        state: classItem.location?.state,
        country: classItem.location?.country,
        pincode: classItem.location?.pincode,
        latitude: classItem.location?.latitude,
        longitude: classItem.location?.longitude,
        road: classItem.location?.road,
        tutorFirstName: classItem.contact?.tutorFirstName,
        tutorLastName: classItem.contact?.tutorLastName,
        tutorCountryCode: classItem.contact?.tutorCountryCode,
        tutorPhoneNo: classItem.contact?.tutorPhoneNo,
        whatsappCountryCode: classItem.contact?.whatsappCountryCode,
        whatsappNo: classItem.contact?.whatsappNo,
        tutorIntro: classItem.contact?.tutorIntro,
        tutorEmailID: classItem.contact?.tutorEmailID
      }));

      // Format course details array with location and contact
      const courseDetailsArray = courseDetailsData.map((course) => ({
        title: course.className,
        subCategoryID: course.subCategory || '0',
        categoryID: course.category || '0',
        timingsFrom: course.timingsFrom || '09:00',
        timingsTo: course.timingsTo || '12:00',
        day: Array.isArray(course.weekdays) ? course.weekdays.join(',') : 'monday',
        type: course.type || 'Offline',
        ageFrom: parseInt(course.fromage) || 0,
        ageTo: parseInt(course.toage) || 0,
        sessionFrom: parseInt(course.sessionFrom) || 0,
        sessionTo: parseInt(course.sessionTo) || 1,
        gender: course.gender || 'both',
        fromPrice: parseFloat(course.fromcost) || 0,
        toPrice: parseFloat(course.tocost) || 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        id: 0,
        activityId: 0,
        address: course.location?.address,
        area: course.location?.area,
        city: course.location?.city,
        state: course.location?.state,
        country: course.location?.country,
        pincode: course.location?.pincode,
        latitude: course.location?.latitude,
        longitude: course.location?.longitude,
        road: course.location?.road,
        tutorFirstName: course.contact?.tutorFirstName,
        tutorLastName: course.contact?.tutorLastName,
        tutorCountryCode: course.contact?.tutorCountryCode,
        tutorPhoneNo: course.contact?.tutorPhoneNo,
        whatsappCountryCode: course.contact?.whatsappCountryCode,
        whatsappNo: course.contact?.whatsappNo,
        tutorIntro: course.contact?.tutorIntro,
        tutorEmailID: course.contact?.tutorEmailID
      }));

      // Add class and course details
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
        console.error('API Error:', error);
        const errorMessage = error.message || "An error occurred while submitting the form. Please try again.";
        toast.error(errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsLoading(false);
      setIsPreviewOpen(false);
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
        formData.append('name', personalDetailsData.firstName + ' ' + personalDetailsData.lastName);
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
        formData.append('activity.categoryId', instituteDetailsData.categoryId?.toString() || '0');
        formData.append('activity.title', instituteDetailsData.programTitle);
        formData.append('activity.companyName', instituteDetailsData.instituteName);
        formData.append('activity.description', instituteDetailsData.introduction || '');
        formData.append('activity.sinceYear', instituteDetailsData.since || '');
        formData.append('activity.gstNo', instituteDetailsData.gstNo || '');

        // Add thumbnail image
        if (selectedThumbnailIndex !== null && images[selectedThumbnailIndex]) {
          formData.append('activity.thumbnailImageFile', images[selectedThumbnailIndex]);
        }

        // Add other images
        images.forEach((image, index) => {
          if (index !== selectedThumbnailIndex) {
            formData.append('activity.images', image);
          }
        });

        // Add tutor details
        formData.append('activity.tutorFirstName', personalDetailsData.firstName);
        formData.append('activity.tutorLastName', personalDetailsData.tutorLastName);
        formData.append('activity.tutorEmailID', personalDetailsData.emailId);
        formData.append('activity.tutorCountryCode', '+91');
        formData.append('activity.tutorPhoneNo', personalDetailsData.phoneNumber);
        formData.append('activity.whatsappCountryCode', '+91');
        formData.append('activity.whatsappNo', personalDetailsData.phoneNumber);
        formData.append('activity.tutorIntro', instituteDetailsData.introduction || '');

        // Add additional information
        formData.append('activity.website', instituteDetailsData.websiteName || '');
        formData.append('activity.classLevel', instituteDetailsData.classLevel || '');
        formData.append('activity.instagramAcc', instituteDetailsData.instagramAccount || '');
        formData.append('activity.youtubeAcc', instituteDetailsData.youtubeAccount || '');
        formData.append('activity.purchaseMaterialIds', instituteDetailsData.purchaseMaterialIds || '');
        formData.append('activity.itemCarryText', instituteDetailsData.itemCarryText || '');
      }

      // Format class details array
      const classDetailsArray = classDetailsData.map((classItem) => ({
        title: classItem.className,
        subCategoryID: classItem.subCategory || '0',
        categoryID: classItem.category || '0',
        timingsFrom: classItem.timingsFrom || '09:00',
        timingsTo: classItem.timingsTo || '12:00',
        day: Array.isArray(classItem.weekdays) ? classItem.weekdays.join(',') : 'monday',
        type: classItem.type || 'Offline',
        ageFrom: parseInt(classItem.fromage) || 0,
        ageTo: parseInt(classItem.toage) || 0,
        sessionFrom: parseInt(classItem.sessionFrom) || 0,
        sessionTo: parseInt(classItem.sessionTo) || 1,
        gender: classItem.gender || 'both',
        fromPrice: parseFloat(classItem.fromcost) || 0,
        toPrice: parseFloat(classItem.tocost) || 0,
        id: 0,
        activityId: 0,
        location: classItem.location || defaultLocation,
        // contact: classItem.contact || defaultContact,
      }));

      // Format course details array
      const courseDetailsArray = courseDetailsData.map((course) => ({
        title: course.className,
        subCategoryID: course.subCategory || '0',
        categoryID: course.category || '0',
        timingsFrom: course.timingsFrom || '09:00',
        timingsTo: course.timingsTo || '12:00',
        day: Array.isArray(course.weekdays) ? course.weekdays.join(',') : 'monday',
        type: course.type || 'Offline',
        ageFrom: parseInt(course.fromage) || 0,
        ageTo: parseInt(course.toage) || 0,
        sessionFrom: parseInt(course.sessionFrom) || 0,
        sessionTo: parseInt(course.sessionTo) || 1,
        gender: course.gender || 'both',
        fromPrice: parseFloat(course.fromcost) || 0,
        toPrice: parseFloat(course.tocost) || 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        id: 0,
        activityId: 0,
        location: course.location || defaultLocation,
        // contact: course.contact || defaultContact,
      }));

      // Add class and course details
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
        console.error('API Error:', error);
        const errorMessage = error.message || "An error occurred while submitting the form. Please try again.";
        toast.error(errorMessage);
        return;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsLoading(false);
      setIsPreviewOpen(false);
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
    const classToEdit = classDetailsData[index];
    if (classToEdit) {
      Object.keys(classToEdit).forEach((key) => {
        setValueClass(key as keyof FormValues, classToEdit[key]);
      });
    }
    setShowClassFields(true);
    setActiveAccordion("item-4");
  };

  const handleEditCourse = (index: number) => {
    const courseToEdit = courseDetailsData[index];
    if (courseToEdit) {
      Object.keys(courseToEdit).forEach((key) => {
        setValueCourse(key as keyof FormValues, courseToEdit[key]);
      });
    }
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
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageToCrop(e.target?.result as string);
        setIsCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
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
    // setImageUrls([]);
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

  // Update the handleLocationSubmit function
  const handleLocationSubmit = async (locationData: Location) => {
    try {
      // Add new location to state
      setSavedLocations(prev => [...prev, locationData]);
      
      // Update form value based on current form type
      if (currentFormType === 'class') {
        setValueClass('location', locationData);
      } else {
        setValueCourse('location', locationData);
      }

      // Close the popup
      setIsLocationPopupOpen(false);

      toast.success('Location saved successfully');
    } catch (error) {
      console.error('Error setting location:', error);
      toast.error('Failed to set location');
    }
  };

  // Update the handleContactSubmit function
  const handleContactSubmit = async (contactData: Contact) => {
    try {
      // Add new contact to state
      setSavedContacts(prev => [...prev, contactData]);
      
      // Update form value based on current form type
      if (currentFormType === 'class') {
        setValueClass('contact', contactData);
      } else {
        setValueCourse('contact', contactData);
      }

      // Close the popup
      setIsContactPopupOpen(false);

      toast.success('Contact saved successfully');
    } catch (error) {
      console.error('Error setting contact:', error);
      toast.error('Failed to set contact');
    }
  };

  // Update the contact select options
  const renderContactSelect = (formType: 'class' | 'course') => {
    const watch = formType === 'class' ? watchClass : watchCourse;
    const errors = formType === 'class' ? errorsClass : errorsCourse;
    const contact = watch('contact');

    return (
      <div className="flex flex-col gap-2">
        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
          Contact<span className="text-red-500">*</span>
        </Label>
        <Select
          value={contact ? `${contact.tutorFirstName} ${contact.tutorLastName}` : ''}
          onValueChange={(value) => handleContactSelect(value, formType)}
        >
          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
            <SelectValue placeholder="Select contact" />
          </SelectTrigger>
          <SelectContent>
            {savedContacts.map(contact => (
              <SelectItem
                key={`${contact.tutorFirstName}-${contact.tutorLastName}`}
                value={`${contact.tutorFirstName} ${contact.tutorLastName}`}
              >
                {`${contact.tutorFirstName} ${contact.tutorLastName}`} ({Object.entries(contact.contactType)
                  .filter(([, value]) => value)
                  .map(([key]) => key)
                  .join(', ')})
              </SelectItem>
            ))}
            <div className="p-2 border-t border-gray-200">
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  const escapeEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    bubbles: true,
                  });
                  document.dispatchEvent(escapeEvent);
                  setIsContactPopupOpen(true)
                }}
              >
                + Add Contact
              </Button>
            </div>
          </SelectContent>
        </Select>
        {errors.contact && (
          <p className="text-red-500 text-xs">{errors.contact.message}</p>
        )}
      </div>
    );
  };

  // Update the handleLocationSelect function
  const handleLocationSelect = (value: string, formType: 'class' | 'course') => {
    const selectedLocation = savedLocations.find(
      (loc) => getLocationValue(loc) === value
    );
    if (formType === 'class') {
      setValueClass('location', selectedLocation || null);
    } else {
      setValueCourse('location', selectedLocation || null);
    }
  };

  // Update the handleContactSelect function
  const handleContactSelect = (value: string, formType: 'class' | 'course') => {
    const selectedContact = savedContacts.find(contact =>
      `${contact.tutorFirstName} ${contact.tutorLastName}` === value
    );

    if (selectedContact) {
      if (formType === 'class') {
        setValueClass('contact', selectedContact);
      } else {
        setValueCourse('contact', selectedContact);
      }
    }
  };

  // Update the location select value handling
  const getLocationValue = (location: Location | null | undefined): string => {
    if (!location) return '';
    return `${location.address}, ${location.area}, ${location.city}`;
  };

  const handleCropComplete = async () => {
    if (!imageRef.current || !imageToCrop) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], 'cropped-profile.jpg', { type: 'image/jpeg' });
        setValuePersonal("profileImageFile", croppedFile);
        setProfileImagePreview(URL.createObjectURL(blob));
        setIsCropDialogOpen(false);
        setImageToCrop(null);
      }
    }, 'image/jpeg');
  };

  // Add this function to handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Check if adding new files would exceed the 8 image limit
    if (images.length + files.length > 8) {
      toast.error("Maximum 8 images allowed");
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      // Check file size (8MB limit)
      if (file.size > 8 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 8MB`);
        return false;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    // Add valid files to images array
    setImages(prev => [...prev, ...validFiles]);
    
    // Create URLs for preview
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setImageUrls(prev => [...prev, url]);
    });

    // If this is the first image, set it as thumbnail
    if (images.length === 0 && validFiles.length > 0) {
      setSelectedThumbnailIndex(0);
      setValueInstitute("thumbnailImageFile", validFiles[0]);
    }
  };

  // Add this function to handle thumbnail selection
  const handleThumbnailSelect = (index: number) => {
    setSelectedThumbnailIndex(index);
    setValueInstitute("thumbnailImageFile", images[index]);
  };

  // Add this function to handle image deletion
  const handleImageDelete = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    
    // If deleted image was thumbnail, update thumbnail
    if (selectedThumbnailIndex === index) {
      if (images.length > 1) {
        const newThumbnailIndex = index === 0 ? 1 : index - 1;
        setSelectedThumbnailIndex(newThumbnailIndex);
        setValueInstitute("thumbnailImageFile", images[newThumbnailIndex]);
      } else {
        setSelectedThumbnailIndex(null);
        setValueInstitute("thumbnailImageFile", new File([], ''));
      }
    } else if (selectedThumbnailIndex && selectedThumbnailIndex > index) {
      setSelectedThumbnailIndex(selectedThumbnailIndex - 1);
    }
  };

  // Add the renderLocationSelect function
  const renderLocationSelect = (formType: 'class' | 'course') => {
    const watch = formType === 'class' ? watchClass : watchCourse;
    const errors = formType === 'class' ? errorsClass : errorsCourse;
    const location = watch('location');

    return (
      <div className="flex flex-col gap-2">
        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
          Location<span className="text-red-500">*</span>
        </Label>
        <Select
          value={location ? getLocationValue(location) : ''}
          onValueChange={(value) => handleLocationSelect(value, formType)}
        >
          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {savedLocations.map(location => (
              <SelectItem
                key={location.id}
                value={getLocationValue(location)}
              >
                {getLocationValue(location)}
              </SelectItem>
            ))}
            <div className="p-2 border-t border-gray-200">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  const escapeEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true,
                    cancelable: true
                  });
                  document.dispatchEvent(escapeEvent);
                  setIsLocationPopupOpen(true);
                }}
              >
                + Add Location
              </Button>
            </div>
          </SelectContent>
        </Select>
        {errors.location && (
          <p className="text-red-500 text-xs">{errors.location.message}</p>
        )}
      </div>
    );
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
                  Profile Details
                  {completedSections.personalDetails && <CircleCheckBig className="text-[#46a758] ml-2" />}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form onSubmit={handleSubmitPersonal(savePersonalDetails)}>
                  <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        First Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Last Name"
                        {...registerPersonal("firstName")}
                        className="h-[52px] border-[#05244f]"
                      />
                      {errorsPersonal.firstName && (
                        <p className="text-red-500 text-xs">{errorsPersonal.firstName.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Last Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Last Name"
                        {...registerPersonal("lastName")}
                        className="h-[52px] border-[#05244f]"
                      />
                      {errorsPersonal.lastName && (
                        <p className="text-red-500 text-xs">{errorsPersonal.lastName.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Mobile<span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center">
                        <Select>
                          <SelectTrigger className="p-0 md:p-4 w-[20%] md:w-[20%]] h-[52px] rounded-l-md rounded-r-none border-[#05244f] border-r-0">
                            <SelectValue placeholder="+91" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="91">+91</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Mobile"
                          maxLength={10}
                          {...registerPersonal("phoneNumber")}
                          className="h-[52px] rounded-l-none border-[#05244f]"
                        />
                      </div>
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
                      {errorsPersonal.dob && (
                        <p className="text-red-500 text-xs">{errorsPersonal.dob.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Profile Image
                      </Label>
                      {!profileImagePreview && (<Input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleProfileImageUpload
                          // const file = e.target.files?.[0];
                          // if (file) {
                          //   setValuePersonal("profileImageFile", file);
                          // }
                        }
                        className="h-[52px] border-[#05244f]"
                      />
                      )}
                      {profileImagePreview && (
                        <div className="relative w-[158px] h-[158px] mb-4">
                          <Image
                            src={profileImagePreview}
                            alt="Profile Preview"
                            width={158}
                            height={158}
                            className="rounded-md w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfileImagePreview(null);
                              if (profileImageInputRef.current) {
                                profileImageInputRef.current.value = '';
                              }
                              setPersonalDetailsData((prevData: any) => ({
                                ...prevData,
                                profileImageFile: new File([], '')
                              }));
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
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold flex w-full">
                        Program Title<span className="text-red-500">*</span><span className="text-[#cecece] font-bold text-[10.6px] flex">Displayed on front page. Eg: Ajay Music classes for 7-18 Age</span>
                      </Label>
                      <Input
                        placeholder="Program Title" maxLength={30}
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
                      <Select
                        onValueChange={(value) => setValueInstitute("since", value)}
                        value={watchInstitute("since") || ""}
                      >
                        <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      Photos<span className="text-red-500">*</span>
                    </Label>
                    
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="relative w-[158px] h-[158px]">
                              <Image
                                src={url}
                                alt={`Uploaded ${index + 1}`}
                                width={158}
                                height={158}
                                className="rounded-md w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleImageDelete(index)}
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
                              <button
                                type="button"
                                onClick={() => handleThumbnailSelect(index)}
                                className={`absolute bottom-2 left-2 px-2 py-1 rounded text-sm ${
                                  selectedThumbnailIndex === index
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {selectedThumbnailIndex === index ? 'Thumbnail' : 'Set as Thumbnail'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {images.length < 8 && (
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
                          <Button variant="outline" type="button">Browse File</Button>
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
                    )}
                    
                    <div className="relative justify-center text-[#cecece] text-[11.6px] font-medium">
                      Maximum 8 images allowed. Each image should be less than 8MB. Supported formats: JPG, PNG, AVIF
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

                  <div className="mt-8">
                    <h3 className="text-[#05244f] text-lg font-semibold mb-4">Additional Information</h3>
                    <div className="border border-[#05244f] rounded-md p-4">
                      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Website Name</Label>
                          <Input
                            placeholder="Enter website name"
                            {...registerInstitute("websiteName")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.websiteName && (
                            <p className="text-red-500 text-xs">{errorsInstitute.websiteName.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Class Level</Label>
                          <Input
                            placeholder="Enter class level"
                            {...registerInstitute("classLevel")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.classLevel && (
                            <p className="text-red-500 text-xs">{errorsInstitute.classLevel.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">Instagram Account</Label>
                          <Input
                            placeholder="Enter Instagram account"
                            {...registerInstitute("instagramAccount")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.instagramAccount && (
                            <p className="text-red-500 text-xs">{errorsInstitute.instagramAccount.message}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="w-[177px] text-black text-[11.6px] font-semibold">YouTube Account</Label>
                          <Input
                            placeholder="Enter YouTube account"
                            {...registerInstitute("youtubeAccount")}
                            className="h-[52px] border-[#05244f]"
                          />
                          {errorsInstitute.youtubeAccount && (
                            <p className="text-red-500 text-xs">{errorsInstitute.youtubeAccount.message}</p>
                          )}
                        </div>
                      </div>
                      {/* <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 my-4 mb-6">
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
                      </div> */}
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
          {/* <AccordionItem value="item-2">
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
          </AccordionItem> */}

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
                        <Select onValueChange={(value) => {
                          setValueClass("category", value);
                          // Reset subcategory when category changes
                          setValueClass("subCategory", "");
                        }} value={watchClass("category") || ""}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((item) => (
                              <SelectItem key={item.id} value={item.title.toString()}>
                                {item.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errorsClass.category && (
                          <p className="text-red-500 text-xs">{errorsClass.category.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Sub Category<span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) => setValueClass("subCategory", value)}
                          value={watchClass("subCategory") || ""}
                          disabled={!watchClass("category")}
                        >
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Sub Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find((category) => category.title.toString() === watchClass("category"))
                              ?.subcategories.map((subCategory) => (
                                <SelectItem key={subCategory.id} value={subCategory.id.toString()}>
                                  {subCategory.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {errorsClass.subCategory && (
                          <p className="text-red-500 text-xs">{errorsClass.subCategory.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                      { }
                      { }
                      {/* <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">No. of Sessions</Label>
                        <Input type="number" {...registerClass("noOfSessions")} min="1" defaultValue="1" placeholder="Enter number of sessions" className="h-[52px] border-[#05244f]" />
                      </div> */}
                      <SessionRangeInput
                        form={classForm as unknown as UseFormReturn<FormValues>}
                        setValue={setValueClass}
                        errors={errorsClass}
                      />
                      <CostRangeInput
                        form={classForm as unknown as UseFormReturn<FormValues>}
                        setValue={setValueClass}
                        errors={errorsClass}
                      />
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Time<span className="text-red-500">*</span>
                        </Label>
                        <TimeRangeInput
                          form={classForm as unknown as UseFormReturn<FormValues>}
                          setValue={setValueClass}
                          errors={errorsClass}
                        />
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
                          value={watchClass("type") || "Offline"} // Default to "Offline" if undefined/null
                        >
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Select Class Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="Offline">Offline</SelectItem>
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

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 mt-4 gap-4 mb-6">
                      {renderLocationSelect('class')}
                      {renderContactSelect('class')}
                    </div>

                    <Button
                      type="button"
                      onClick={saveClassDetails}
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
                        <Select onValueChange={(value) => {
                          setValueCourse("category", value);
                          // Reset subcategory when category changes
                          setValueCourse("subCategory", "");
                        }} value={watchCourse("category") || ""}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((item) => (
                              <SelectItem key={item.id} value={item.title.toString()}>
                                {item.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errorsCourse.category && (
                          <p className="text-red-500 text-xs">{errorsCourse.category.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Sub Category<span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) => setValueCourse("subCategory", value)}
                          value={watchCourse("subCategory") || ""}
                          disabled={!watchCourse("category")}
                        >
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Sub Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find((category) => category.title.toString() === watchCourse("category"))
                              ?.subcategories.map((subCategory) => (
                                <SelectItem key={subCategory.id} value={subCategory.id.toString()}>
                                  {subCategory.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {errorsCourse.subCategory && (
                          <p className="text-red-500 text-xs">{errorsCourse.subCategory.message}</p>
                        )}
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
                      <SessionRangeInput
                        form={courseForm as UseFormReturn<FormValues>}
                        setValue={setValueCourse}
                        errors={errorsCourse}
                      />
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
                          errors={errorsCourse} />
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

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 mt-4 gap-4 mb-6">
                      {renderLocationSelect('course')}
                      {renderContactSelect('course')}
                    </div>

                    <Button
                      type="button"
                      onClick={handleCourseSubmit}
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
        <LocationPopupScreen open={isLocationPopupOpen} setOpen={setIsLocationPopupOpen} onLocationSubmit={handleLocationSubmit} />
        <ContactPopupScreen
          open={isContactPopupOpen}
          setOpen={setIsContactPopupOpen}
          onContactSubmit={(contactData: any) => handleContactSubmit(contactData)}
        />
      </div>

      {/* Add this dialog component for image cropping */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Crop Profile Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {imageToCrop && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                className="max-w-full"
              >
                <img
                  ref={imageRef}
                  src={imageToCrop}
                  alt="Profile to crop"
                  className="max-w-full"
                />
              </ReactCrop>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCropDialogOpen(false);
                  setImageToCrop(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCropComplete}>
                Crop & Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
