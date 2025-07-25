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
import { registerVendor, validateUserRegistration, UserValidationRequest } from "@/app/services/vendorService";
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
import ImageCropper from '@/app/components/ImageCropper';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Checkbox } from "@/components/ui/checkbox";
import { TermsAndPrivacyContent } from "@/components/TermsAndPrivacyContent";

// Personal details form schema
const personalDetailsSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  emailId: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number must not exceed 15 digits"),
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
  // countryCode: yup.string().required("Country Code is required"),
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
  timingsFrom: yup.string()
    .required('From Time is required'),
  timingsTo: yup.string()
    .required('To Time is required')
    .test(
  'is-greater-or-equal-to-timingsFrom',
  'To Time must be after From Time (can be next day, max 12 hours)',
  function (value) {
    const { timingsFrom } = this.parent;
    if (!timingsFrom || !value) return true;

    const [fromH, fromM] = timingsFrom.split(':').map(Number);
    const [toH, toM] = value.split(':').map(Number);
    const fromMinutes = fromH * 60 + fromM;
    const toMinutes = toH * 60 + toM;

    // If toMinutes <= fromMinutes, treat as next day
    const adjustedToMinutes = toMinutes <= fromMinutes ? toMinutes + 24 * 60 : toMinutes;
    const duration = adjustedToMinutes - fromMinutes;

    // Allow only if duration is > 0 and <= 12 hours (720 minutes)
    return duration > 0 && duration <= 12 * 60;
  }
),
  weekdays: yup.array().of(yup.string()).min(1, 'At least one weekday is required'),
  fromage: yup.string(),
  toage: yup.string(),
  fromcost: yup.string(),
  tocost: yup.string(),
  gender: yup.string().required('Gender is required'),
  experienceLevel: yup.string().required('Experience level is required'),
  noOfSessions: yup.string(),
  location: yup.object().nullable().required('Location is required'),
  contact: yup.object().nullable().required('Contact is required')
});

// Course details form schema
const courseDetailsSchema = yup.object().shape({
  type: yup.string().required('Type is required'),
  className: yup.string().required('Course name is required'),
  category: yup.string().required('Category is required'),
  subCategory: yup.string().required('Sub-category is required'),
  time: yup.string().required('Time is required'),
  timingsFrom: yup.string()
    .required('From Time is required'),
  timingsTo: yup.string()
    .required('To Time is required')
    .test(
      'is-greater-or-equal-to-timingsFrom',
      'To Time must be equal to or greater than From Time',
      function (value) {
        const { timingsFrom } = this.parent;
        if (!timingsFrom || !value) return true;

        // Convert times to comparable values
        const fromTime = new Date(`2000-01-01T${timingsFrom}`);
        const toTime = new Date(`2000-01-01T${value}`);

        return toTime >= fromTime;
      }
    ),
  weekdays: yup.array().of(yup.string()).min(1, 'At least one weekday is required'),
  fromage: yup.string(),
  toage: yup.string(),
  fromcost: yup.string(),
  tocost: yup.string(),
  gender: yup.string().required('Gender is required'),
  experienceLevel: yup.string().required('Experience level is required'),
  noOfSessions: yup.string(),
  location: yup.object().nullable().required('Location is required'),
  contact: yup.object().nullable().required('Contact is required')
});

export default function RegistrationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [directory, setDirectory] = useState<DirectoryItem[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // const thumbnailInputRef = useRef<HTMLInputElement>(null);
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
  const [locationPopupFormType, setLocationPopupFormType] = useState<'class' | 'course'>('class');
  const [classDetailsData, setClassDetailsData] = useState<any[]>([]);
  const [courseDetailsData, setCourseDetailsData] = useState<any[]>([]);
  const [personalDetailsData, setPersonalDetailsData] = useState<any>(null);
  const [instituteDetailsData, setInstituteDetailsData] = useState<any>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [courses, setCourses] = useState<any[]>([]);
  // const [ setThumbnailPreview] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  // Add a state to track which item is being edited
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsModalType, setTermsModal] = useState<"privacy" | "terms">('privacy');

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

  // Add currentFormType state
  const [currentFormType] = useState<'class' | 'course'>('class');

  // Remove the savedLocations state and related localStorage code
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [savedContacts, setSavedContacts] = useState<Contact[]>([]);

  // Add state to track if profile is auto-filled
  const [isProfileAutoFilled, setIsProfileAutoFilled] = useState(false);

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
      timingsFrom: '00:00',
      timingsTo: '00:00',
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
      timingsFrom: '00:00',
      timingsTo: '00:00',
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

  // Check for existing user data and auto-fill profile details
  useEffect(() => {
    const checkExistingUserData = () => {
      try {
        const userDataString = localStorage.getItem("userData");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          
          // Check if user data exists and has required fields
          if (userData && userData.Name && userData.UserName) {
            // Auto-fill the personal details form
            const nameParts = userData.Name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            setValuePersonal("firstName", firstName);
            setValuePersonal("lastName", lastName);
            setValuePersonal("phoneNumber", userData.UserName);
            setValuePersonal("emailId", userData.emailId || '');
            // Capitalize gender to match form options
            const genderValue = userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1).toLowerCase() : '';
            setValuePersonal("gender", genderValue);
            
            // Handle date of birth - convert to proper format for date input
            if (userData.dob) {
              const dobDate = new Date(userData.dob);
              // Format date as YYYY-MM-DD for the date input
              const formattedDob = dobDate.toISOString().split('T')[0];
              setValuePersonal("dob", formattedDob as any);
            }
            
            // If profile image exists, set it
            if (userData.ProfileImage) {
              setProfileImagePreview(userData.ProfileImage);
            }
            
            setIsProfileAutoFilled(true);
            
            // Mark personal details as completed since they're auto-filled
            setCompletedSections(prev => ({ ...prev, personalDetails: true }));
            setPersonalDetailsData({
              firstName,
              lastName,
              phoneNumber: userData.UserName,
              emailId: userData.emailId || '',
              gender: genderValue,
              dob: userData.dob ? new Date(userData.dob) : null,
              profileImageFile: null
            });
            
            // Show success message
            toast.success("Profile details auto-filled from your existing account!");
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };

    checkExistingUserData();
  }, [setValuePersonal]);

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

      // Prepare validation data
      const validationData: UserValidationRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        emailId: data.emailId,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        dob: data.dob ? data.dob.toISOString().split('T')[0] : undefined
      };

      // Call validation API
      const validationResult = await validateUserRegistration(validationData);

      if (!validationResult.isValid) {
        // Handle validation errors
        if (validationResult.errors) {
          // Check if errors is an array of strings (new format)
          if (Array.isArray(validationResult.errors)) {
            // Display each error message
            validationResult.errors.forEach(error => {
              toast.error(error);
            });
          } else {
            // Handle object format (old format)
            Object.entries(validationResult.errors).forEach(([field, errors]) => {
              if (errors.length > 0) {
                toast.error(`${field}: ${errors[0]}`);
              }
            });
          }
        } else if (validationResult.message) {
          toast.error(validationResult.message);
        } else {
          toast.error("Validation failed. Please check your details.");
        }
        return;
      }

      // Store personal details in state
      setPersonalDetailsData(data);
      
      // Mark section as completed and move to next
      setCompletedSections(prev => ({ ...prev, personalDetails: true }));
      setActiveAccordion("item-1");
      
      // Show appropriate success message
      if (isProfileAutoFilled) {
        toast.success(`Profile details confirmed and saved successfully!`);
      } else {
        toast.success(`Personal details saved successfully!`);
      }
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
      // Get all form values
      const classData = classForm.getValues();
const location: Location | null = classData.location;
if (location) {
  data.address = location.address;
  data.area = location.area;
  data.city = location.city;
  data.state = location.state;
  data.country = location.country;
  data.pincode = location.pincode;
  data.latitude = location.latitude;
  data.longitude = location.longitude;
  data.road = location.road;
}
      // Create class details object
      const classDetails = {
        ...data,
        location: location || defaultLocation,
        contact: classData.contact || null,
        id: Date.now(), // Add unique ID for each class
        category: classData.category || '0',
        className: classData.className || '',
        experienceLevel: classData.experienceLevel || 'beginner',
        fromage: classData.fromage || '0',
        toage: classData.toage || '0',
        fromcost: classData.fromcost || '0',
        tocost: classData.tocost || '0',
        type: classData.type || 'Offline',
        gender: classData.gender || 'both',
        noOfSessions: data.noOfSessions || '1',
        time: classData.time || '09:00',
        timingsFrom: classData.timingsFrom || '09:00',
        timingsTo: classData.timingsTo || '12:00',
        weekdays: classData.weekdays || [],
        sessionFrom: classData.sessionFrom || '0',
        sessionTo: classData.sessionTo || '1',
      };

      if (editingIndex !== null) {
        // Update existing item
        setClassDetailsData(prev => prev.map((item, index) =>
          index === editingIndex ? classDetails : item
        ));
      } else {
        // Add new item
        setClassDetailsData(prev => [...prev, classDetails]);
      }

      classForm.reset();
      setEditingIndex(null); // Reset editing index
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

      if (editingIndex !== null) {
        // Update existing item
        setCourseDetailsData(prev => prev.map((item, index) =>
          index === editingIndex ? courseDetails : item
        ));
      } else {
        // Add new item
        setCourseDetailsData(prev => [...prev, courseDetails]);
      }

      courseForm.reset();
      setEditingIndex(null); // Reset editing index
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

      // Check if personal details are completed
      if (!completedSections.personalDetails || !personalDetailsData) {
        toast.error("Please complete the Profile Details section first");
        setActiveAccordion("item-0");
        return;
      }

      // Check if institute details are completed
      if (!completedSections.instituteDetails || !instituteDetailsData) {
        toast.error("Please complete the Institute Details section first");
        setActiveAccordion("item-1");
        return;
      }

      // Check if at least one class or course is added
      if (classDetailsData.length === 0 && courseDetailsData.length === 0) {
        toast.error("Please add at least one class or course");
        setActiveAccordion("item-4");
        return;
      }
    if (!isTermsChecked) {
      toast.error("Please agree to the Terms & Conditions and Privacy Policy before submitting.");
      return;
    }
      // If all validations pass, show the preview popup
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error in validation:", error);
      toast.error("An error occurred while validating the form. Please try again.");
    }
  };

  // New function to handle actual form submission after preview confirmation
  const handleSubmitAfterPreview = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Add personal details
      if (personalDetailsData) {
        formData.append('name', personalDetailsData.firstName + ' ' + personalDetailsData.lastName);
        formData.append('emailId', personalDetailsData.emailId);
        // Strip country code from phone number before sending
        const phoneNumber = personalDetailsData.phoneNumber.replace(/^\+91/, '');
        formData.append('phoneNumber', phoneNumber);
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
        latitude: classItem.location?.latitude || '18.5204',
        longitude: classItem.location?.longitude || '73.8567',
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
        latitude: course.location?.latitude || '18.5204',
        longitude: course.location?.longitude || '73.8567',
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
          setIsPreviewOpen(false);
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

  // Update the handleEditClass function
  const handleEditClass = (index: number) => {
    const classToEdit = classDetailsData[index];
    if (classToEdit) {
      Object.keys(classToEdit).forEach((key) => {
        setValueClass(key as keyof FormValues, classToEdit[key]);
      });
      setEditingIndex(index); // Set the index of the item being edited
    }
    setShowClassFields(true);
    setActiveAccordion("item-4");
  };

  // Update the handleEditCourse function
  const handleEditCourse = (index: number) => {
    const courseToEdit = courseDetailsData[index];
    if (courseToEdit) {
      Object.keys(courseToEdit).forEach((key) => {
        setValueCourse(key as keyof FormValues, courseToEdit[key]);
      });
      setEditingIndex(index); // Set the index of the item being edited
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

  // const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setValueInstitute("thumbnailImageFile", file);
  //     setThumbnailPreview(URL.createObjectURL(file));
  //   }
  // };
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setTempImageUrl(imageUrl);
      setIsCropperOpen(true);
    }
  };

  const handleCropComplete = (croppedImage: File) => {
    setValuePersonal("profileImageFile", croppedImage);
    const previewUrl = URL.createObjectURL(croppedImage);
    setProfileImagePreview(previewUrl);
    setTempImageUrl(null);
    setIsCropperOpen(false);
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
    // setThumbnailPreview(null);

    // Reset completion states
    setCompletedSections({
      personalDetails: false,
      instituteDetails: false,
      classDetails: false
    });

    // Reset auto-fill state
    setIsProfileAutoFilled(false);
    setProfileImagePreview(null);

    // Reset active accordion
    setActiveAccordion("item-0");
  };

  // Update the handleLocationSubmit function
  const handleLocationSubmit = async (locationData: Location) => {
    try {
    setSavedLocations(prev => [...prev, locationData]);
    if (locationPopupFormType === 'class') {
      setValueClass('location', locationData, { shouldValidate: true });
    } else {
      setValueCourse('location', locationData, { shouldValidate: true });
    }
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
        setValueClass('contact', contactData, { shouldValidate: true });
      } else {
        setValueCourse('contact', contactData, { shouldValidate: true });
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
      <div className="flex gap-2 items-center">
        <select
          className="w-full h-[52px] border border-[#05244f] rounded-lg px-2"
          value={contact?.id || ''}
          onChange={e => {
            const selected = savedContacts.find(c => c.id === e.target.value) || null;
            if (formType === 'class') {
              setValueClass('contact', selected, { shouldValidate: true });
            } else {
              setValueCourse('contact', selected, { shouldValidate: true });
            }
          }}
        >
          <option value="">Select contact</option>
          {savedContacts.map(contact => (
            <option key={contact.id} value={contact.id}>
              {contact.tutorFirstName} {contact.tutorLastName}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          className="h-[52px] px-3"
          onClick={() => setIsContactPopupOpen(true)}
        >
          + Add
        </Button>
      </div>
      {errors.contact && (
        <p className="text-red-500 text-xs">{errors.contact.message}</p>
      )}
    </div>
  );
};

  // Update the handleLocationSelect function
  // const handleLocationSelect = (id: string, formType: 'class' | 'course') => {
  //   const selected = savedLocations.find(loc => loc.id === id) || null;
  // if (formType === 'class') {
  //   setValueClass('location', selected, { shouldValidate: true });
  // } else {
  //   setValueCourse('location', selected, { shouldValidate: true });
  // }
  // };

  // Update the handleContactSelect function
  // const handleContactSelect = (value: string, formType: 'class' | 'course') => {
  //   const selectedContact = savedContacts.find(contact =>
  //     `${contact.tutorFirstName} ${contact.tutorLastName}` === value
  //   );

  //   if (selectedContact) {
  //     if (formType === 'class') {
  //       setValueClass('contact', selectedContact, { shouldValidate: true });
  //     } else {
  //       setValueCourse('contact', selectedContact, { shouldValidate: true });
  //     }
  //   }
  // };

  // Update the location select value handling
function getLocationValue(location: Location | null | undefined): string {
  if (!location) return '';
  return `${location.address}, ${location.area}, ${location.city}`;
}

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
      <div className="flex gap-2 items-center">
        <select
          className="w-full h-[52px] border border-[#05244f] rounded-lg px-2"
          value={location?.id || ''}
          onChange={e => {
            const selected = savedLocations.find(loc => loc.id === e.target.value) || null;
            if (formType === 'class') {
              setValueClass('location', selected, { shouldValidate: true });
            } else {
              setValueCourse('location', selected, { shouldValidate: true });
            }
          }}
        >
          <option value="">Select location</option>
          {savedLocations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {getLocationValue(loc)}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          className="h-[52px] px-3"
          onClick={() => {
            setLocationPopupFormType(formType);
            setIsLocationPopupOpen(true);
          }}
        >
          + Add
        </Button>
      </div>
      {errors.location && (
        <p className="text-red-500 text-xs">{errors.location.message}</p>
      )}
    </div>
  );
};

  const handleCopyClass = (index: number) => {
    const classToCopy = classDetailsData[index];
    if (classToCopy) {
      const copiedClass = {
        ...classToCopy,
        className: `${classToCopy.className}`,
        id: Date.now() // Add new unique ID
      };
      setClassDetailsData(prev => [...prev, copiedClass]);
    }
  };

  const handleCopyCourse = (index: number) => {
    const courseToCopy = courseDetailsData[index];
    if (courseToCopy) {
      const copiedCourse = {
        ...courseToCopy,
        className: `${courseToCopy.className} (Copy)`,
        id: Date.now() // Add new unique ID
      };
      setCourseDetailsData(prev => [...prev, copiedCourse]);
    }
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
                {isProfileAutoFilled && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="text-blue-800 text-sm font-medium">
                        ✓ Profile details have been auto-filled from your existing account. These fields are locked to maintain consistency.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsProfileAutoFilled(false)}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmitPersonal(savePersonalDetails)}>
                  <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        First Name<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="First Name"
                        {...registerPersonal("firstName")}
                        className={`h-[52px] border-[#05244f] ${isProfileAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        disabled={isProfileAutoFilled}
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
                        className={`h-[52px] border-[#05244f] ${isProfileAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        disabled={isProfileAutoFilled}
                      />
                      {errorsPersonal.lastName && (
                        <p className="text-red-500 text-xs">{errorsPersonal.lastName.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Mobile<span className="text-red-500">*</span>
                      </Label>
                      <PhoneInput
                        country={'in'}
                        value={watchPersonal("phoneNumber")}
                        onChange={(value) => {
                          setValuePersonal("phoneNumber", value);
                        }}
                        inputClass={`!h-[52px] !pl-[60px] !w-full !border !border-[#05244f] !rounded-[6px] ${isProfileAutoFilled ? '!bg-gray-100 !cursor-not-allowed' : ''}`}
                        buttonClass="!border !border-[#05244f] !rounded-[6px]"
                        containerClass="!w-full !border !border-[#05244f] !rounded-[6px]"
                        inputProps={{
                          name: 'phoneNumber',
                          required: true,
                          disabled: isProfileAutoFilled,
                        }}
                        disabled={isProfileAutoFilled}
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
                        className={`h-[52px] border-[#05244f] ${isProfileAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        disabled={isProfileAutoFilled}
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
                        disabled={isProfileAutoFilled}
                      >
                        <SelectTrigger className={`w-full h-[52px] border-[#05244f] ${isProfileAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
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
                        className={`h-[52px] border-[#05244f] ${isProfileAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        disabled={isProfileAutoFilled}
                      />
                      {errorsPersonal.dob && (
                        <p className="text-red-500 text-xs">{errorsPersonal.dob.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Profile Image
                      </Label>
                      {!profileImagePreview && (
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            className={`h-[52px] border-[#05244f] ${isProfileAutoFilled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            disabled={isProfileAutoFilled}
                          />
                        </div>
                      )}
                      {profileImagePreview && (
                        <div className="relative w-[158px] h-[158px] mb-4">
                          <div className="w-full h-full overflow-hidden rounded-md">
                            <Image
                              src={profileImagePreview}
                              alt="Profile Preview"
                              width={158}
                              height={158}
                              className="w-full h-full object-cover"
                              style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfileImagePreview(null);
                              if (profileImageInputRef.current) {
                                profileImageInputRef.current.value = '';
                              }
                              setValuePersonal("profileImageFile", new File([], ''));
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
                    {isLoading ? "Saving..." : isProfileAutoFilled ? "Confirm & Save" : "Save"}
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
                                className={`absolute bottom-2 left-2 px-2 py-1 rounded text-sm ${selectedThumbnailIndex === index
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
                          <Select
                            onValueChange={(value) => setValueInstitute("classLevel", value)}
                            value={watchInstitute("classLevel") || ""}
                          >
                            <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                              <SelectValue placeholder="Select Class Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Individual">Individual</SelectItem>
                              <SelectItem value="Academy">Academy</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <SelectItem value="Offline">In Person</SelectItem>
                          </SelectContent>
                        </Select>

                        {errorsClass.type && (
                          <p className="text-red-500 text-xs">{errorsClass.type.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2 border border-[#05244f] rounded-md">
                        {[
  { full: 'Sunday', short: 'Su' },
  { full: 'Monday', short: 'Mo' },
  { full: 'Tuesday', short: 'Tu' },
  { full: 'Wednesday', short: 'We' },
  { full: 'Thursday', short: 'Th' },
  { full: 'Friday', short: 'Fr' },
  { full: 'Saturday', short: 'Sa' }
].map((day) => (
                          <div key={day.short} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={day.short.toLowerCase()}
                              className="h-4 w-4 border-[#05244f]"
                              onChange={() => handleWeekdayChange(day.short, true)}
                              checked={(watchClass('weekdays') || []).includes(day.short)}
                            />
                            <label htmlFor={day.short.toLowerCase()} className="text-sm">{day.full}</label>
                          </div>
                        ))}
                        {errorsClass.weekdays && (
  <p className="text-red-500 text-xs">{errorsClass.weekdays.message}</p>
)}
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

          {/* Course Details Section */}
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
  { full: 'Sunday', short: 'Su' },
  { full: 'Monday', short: 'Mo' },
  { full: 'Tuesday', short: 'Tu' },
  { full: 'Wednesday', short: 'We' },
  { full: 'Thursday', short: 'Th' },
  { full: 'Friday', short: 'Fr' },
  { full: 'Saturday', short: 'Sa' }
].map((day) => (
                        <div key={day.short} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`course-${day.short.toLowerCase()}`}
                            className="h-4 w-4 border-[#05244f]"
                            onChange={() => handleWeekdayChange(day.short, false)}
                            checked={(watchCourse('weekdays') || []).includes(day.short)}
                          />
                          <label htmlFor={`course-${day.short.toLowerCase()}`} className="text-sm">{day.full}</label>
                        </div>
                      ))}
                      {errorsCourse.weekdays && (
                        <p className="text-red-500 text-xs">{errorsCourse.weekdays.message}</p>
                      )}
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
                onEdit={handleEditClass}
                onDelete={handleDeleteClass}
                onCopy={handleCopyClass}
              />
            </div>
          )}

          {courseDetailsData.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[#05244f] text-lg font-semibold mb-4">Courses</h3>
              <ClassCourseTable
                items={courseDetailsData}
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
                onCopy={handleCopyCourse}
              />
            </div>
          )}
        </div>

        {/* Directory Section */}
        {(savedLocations.length > 0 || savedContacts.length > 0) && (
          <div className="mt-8">
            <h3 className="text-[#05244f] text-lg font-semibold mb-4">Directory</h3>
            <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-4 px-8">
              <DirectoryTable
                directory={savedLocations.map((location, index) => {
                  const contact = savedContacts[index] || null;
                  return {
                    address: `${location.address}, ${location.area}, ${location.city}, ${location.state}, ${location.country} - ${location.pincode}`,
                    isPrimary: contact?.contactType?.primary ? 'Yes' : 'No',
                    firstName: contact?.tutorFirstName || '',
                    lastName: contact?.tutorLastName || '',
                    phoneNumber: contact?.tutorPhoneNo || '',
                    whatsappNumber: contact?.whatsappNo || '',
                    email: contact?.tutorEmailID || '',
                    contactType: contact?.contactType || { primary: false, secondary: false, billing: false }
                  };
                })}
                handleDelete={(index) => {
                  setSavedLocations(prev => prev.filter((_, i) => i !== index));
                  setSavedContacts(prev => prev.filter((_, i) => i !== index));
                }}
              />
            </div>
          </div>
        )}

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
<div className="flex items-center justify-center gap-2 mt-[15px]">
              <Checkbox
                id="terms"
                checked={isTermsChecked}
                onCheckedChange={(checked) => setIsTermsChecked(checked as boolean)}
              />
              <label htmlFor="terms" className="text-[#c6c7c7] text-xs mt-2 trajan-pro font-bold">
                By proceeding, you agree to our{" "}
                <button
                  type="button"
                  onClick={() => {setShowTermsModal(true); setTermsModal('terms')}}
                  className="text-[#3e606e] hover:underline"
                >
                  Terms & Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => {setShowTermsModal(true); setTermsModal('privacy')}}
                  className="text-[#3e606e] hover:underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            <TermsAndPrivacyContent
                          isOpen={showTermsModal}
                          onClose={() => setShowTermsModal(false)} type={termsModalType}
                        />
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
          profileDetails={personalDetailsData ? {
            firstName: personalDetailsData.firstName,
            lastName: personalDetailsData.lastName,
            emailId: personalDetailsData.emailId,
            phoneNumber: personalDetailsData.phoneNumber
          } : undefined}
        />
      </div>

      {/* Add ImageCropper component */}
      {tempImageUrl && (
        <ImageCropper
          isOpen={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            setTempImageUrl(null);
          }}
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}
