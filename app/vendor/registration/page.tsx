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
import LocationPopupScreen from "./locationSelection";
import ContactPopupScreen from "./contactSelection";
import { DirectoryTable } from "./directoryList";
import { SelectGroup } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
import { registerVendor, generateLoginOtp, login, createVendorActivity, createVendorClass } from "@/app/services/vendorService";
import { CircleCheckBig } from "lucide-react";
import * as yup from "yup";
import { ClassTable } from "./classList";
import SuccessPopupScreen from "./SuccessPopupScreen";
import { Category } from "@/app/homepage/categories";
import { getAllSubCategories, getAllCategories } from "@/services/hobbyService";
import { ContactData } from "./contactSelection";
import { LocationData } from "./locationSelection";
import { DirectoryItem } from "./directoryList";
import CostRangeInput from "./costRangeInput";
import AgeRangeInput from "./ageRangeInput";
import { Checkbox } from "@/components/ui/checkbox";

// Personal details form schema
const personalDetailsSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  emailId: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
});

// Institute details form schema
const instituteDetailsSchema = yup.object().shape({
  programTitle: yup.string().required("Program title is required"),
  instituteName: yup.string().required("Institute name is required"),
  since: yup.string(),
  gstNo: yup.string(),
  introduction: yup.string(),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  whatsappNumber: yup.string(),
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
  landmark: yup.string().required("Landmark is required"),
  area: yup.string().required("Area is required"),
  city: yup.string().required("City is required"),
  state: yup.string(),
  country: yup.string(),
  pincode: yup.string().required("Pincode is required"),
  latitude: yup.number(),
  longitude: yup.number(),
});

// Additional info form schema
const additionalInfoSchema = yup.object().shape({
  websiteName: yup.string(),
  classLevel: yup.string(),
  instagramAccount: yup.string(),
  youtubeAccount: yup.string(),
});

// Class details form schema
const classDetailsSchema = yup.object().shape({
  className: yup.string().required("Class name is required"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string(),
  location: yup.string().required("Location is required"),
  contact: yup.string().required("Contact is required"),
  time: yup.string().required("Time is required"),
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
});

// Course details form schema
const courseDetailsSchema = yup.object().shape({
  className: yup.string().required("Class name is required"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string(),
  location: yup.string().required("Location is required"),
  contact: yup.string().required("Contact is required"),
  time: yup.string().required("Time is required"),
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
});

export default function RegistrationForm() {
  const [images, setImages] = useState<File[]>([]);  // Change to store File objects instead of URLs
  const [imageUrls, setImageUrls] = useState<string[]>([]); // New state for preview URLs
  const [isInstDetailsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClassFields, setShowClassFields] = useState(false);
  const [showCourseFields, setShowCourseFields] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [activeAccordion, setActiveAccordion] = useState("item-0");
  const [categories, setCategories] = useState<Category[]>([]);
  const [completedSections, setCompletedSections] = useState({
    personalDetails: false,
    instituteDetails: false,
    additionalInfo: false,
    classDetails: false
  });

  const [courses, setCourses] = useState<any[]>([]);

  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [directory, setDirectory] = useState<DirectoryItem[]>([]);

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
    } else if (!completedSections.additionalInfo) {
      setActiveAccordion("item-2");
    } else if (!completedSections.classDetails) {
      setActiveAccordion("item-4");
    } else {
      setActiveAccordion(""); // No default open if all sections are completed
    }
  }, [completedSections, setActiveAccordion]);

  useEffect(() => {
    if (showCourseFields) {
      setActiveAccordion("item-5");
    }
  }, [showCourseFields, setActiveAccordion]);

  // Form for personal details
  const personalForm = useForm({
    resolver: yupResolver(personalDetailsSchema),
    mode: "onChange",
  });

  // Form for institute details
  const instituteForm = useForm({
    resolver: yupResolver(instituteDetailsSchema),
    mode: "onChange",
  });

  // Form for additional info
  const additionalForm = useForm({
    resolver: yupResolver(additionalInfoSchema),
    mode: "onChange",
  });

  // Form for class details
  const classForm = useForm({
    resolver: yupResolver(classDetailsSchema),
    mode: "onChange",
  });

  // Form for course details
  const courseForm = useForm({
    resolver: yupResolver(courseDetailsSchema),
    mode: "onChange",
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
    handleSubmit: handleSubmitInstitute,
    setValue: setValueInstitute,
    watch: watchInstitute,
    formState: { errors: errorsInstitute },
  } = instituteForm;

  const {
    register: registerAdditional,
    handleSubmit: handleSubmitAdditional,
    setValue: setValueAdditional,
    watch: watchAdditionalInfo,
  } = additionalForm;

  const {
    register: registerClass,
    handleSubmit: handleSubmitClass,
    setValue: setValueClass,
    watch: watchClass,
    formState: { errors: errorsClass },
  } = classForm;

  const {
    register: registerCourse,
    handleSubmit: handleSubmitCourse,
    setValue: setValueCourse,
    watch: watchCourse,
    formState: { errors: errorsCourse },
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

    // Load additional info
    const savedAdditionalInfo = localStorage.getItem('additionalInfo');
    if (savedAdditionalInfo) {
      const additionalData = JSON.parse(savedAdditionalInfo);
      Object.keys(additionalData).forEach((key) => {
        setValueAdditional(key as keyof typeof additionalInfoSchema.fields, additionalData[key]);
      });
      setCompletedSections(prev => ({ ...prev, additionalInfo: true }));
    }

    // Load class details
    const savedClassDetails = localStorage.getItem('classDetails');
    if (savedClassDetails) {
      const classData = JSON.parse(savedClassDetails);
      setCourses(classData);
      Object.keys(classData).forEach((key) => {
        setValueClass(key as keyof typeof classDetailsSchema.fields, classData[key]);
      });
    }

    // Load course details
    const savedCourseDetails = localStorage.getItem('corseDetails');
    if (savedCourseDetails) {
      const courseData = JSON.parse(savedCourseDetails);
      setCourses(courseData);
      Object.keys(courseData).forEach((key) => {
        setValueCourse(key as keyof typeof courseDetailsSchema.fields, courseData[key]);
      });
    }

    // Load saved images
    const savedImages = localStorage.getItem('images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, [setValuePersonal, setValueInstitute, setValueAdditional, setCourses, setValueClass, setValueCourse]);

  // Save class details to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem("classDetails", JSON.stringify(courses));
  }, [courses]);

  // Save course details to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem("corseDetails", JSON.stringify(courses));
  }, [courses]);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

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

  // Function to handle new contact submission
  const handleContactSubmit = (contactData: ContactData) => {
    setContacts(prev => [...prev, contactData]);
  };

  // Load locations from localStorage on initial render
  useEffect(() => {
    const loadLocations = () => {
      try {
        const storedLocations = localStorage.getItem('locations');
        if (storedLocations) {
          setLocations(JSON.parse(storedLocations));
        }
      } catch (error) {
        console.error('Error loading locations from localStorage:', error);
      }
    };

    const loadContacts = () => {
      try {
        const storedContacts = localStorage.getItem('contacts');
        if (storedContacts) {
          setContacts(JSON.parse(storedContacts));
        }
      } catch (error) {
        console.error('Error loading contacts from localStorage:', error);
      }
    };

    // Load locations immediately when the component mounts
    loadLocations();
    loadContacts();

    // Set up event listener for storage changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'locations') {
        loadLocations();
      }
      if (event.key === 'contacts') {
        loadContacts();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save locations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('locations', JSON.stringify(locations));
    } catch (error) {
      console.error('Error saving locations to localStorage:', error);
    }
  }, [locations]);

  // Function to handle new location submission
  const handleLocationSubmit = (locationData: LocationData) => {
    setLocations(prev => [...prev, locationData]);
  };

  const handleDeleteClass = (index: number) => {
    // Remove the class at the specified index
    setCourses(prev => prev.filter((item: any, i: number) => i !== index));
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

      // Prepare vendor registration data
      const vendorData = {
        id: 0,
        name: data.name,
        emailId: data.emailId,
        phoneNumber: data.phoneNumber,
        gender: data.gender
      };

      // Call vendor registration API
      const response = await registerVendor(vendorData);

      if (response) {
        // Store only the API response in localStorage
        localStorage.setItem('vendorResponse', JSON.stringify(response));
        
        // Store the vendor ID in state
        setVendorId(response.vendorId.toString());

        // Generate OTP for login
        await generateLoginOtp(response.username);

        // Login with OTP
        await login(response.username, '1234');

        setCompletedSections(prev => ({ ...prev, personalDetails: true }));
        setActiveAccordion("item-1");
        toast.success(`Personal details saved successfully!`);
      } else {
        toast.error("Failed to register vendor. Please try again.");
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
      toast.error("An error occurred while saving personal details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save institute details to API and proceed to the next section
  const saveInstituteDetails = async (data: any) => {
    try {
      setIsLoading(true);

      // Get vendor ID from localStorage
      const vendorResponse = localStorage.getItem('vendorResponse');
      if (!vendorResponse) {
        throw new Error('Vendor ID not found');
      }

      const { vendorId } = JSON.parse(vendorResponse);

      // Check if there are any images uploaded
      if (images.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      // Validate required fields
      if (!data.programTitle) {
        toast.error("Program title is required");
        return;
      }

      // Create FormData object
      const formData = new FormData();
      
      // Add the image file directly
      formData.append('thumbnailImageFile', images[0]); // Use the first image as thumbnail

      // Add all other fields
      formData.append('vendorId', vendorId);
      formData.append('type', 'INSTITUTE');
      formData.append('categoryId', '0');
      formData.append('title', data.programTitle);
      formData.append('companyName', data.instituteName);
      formData.append('description', data.introduction || '');
      formData.append('sinceYear', data.since || '');
      formData.append('gstNo', data.gstNo || '');
      formData.append('address', data.address || '');
      formData.append('road', data.road || '');
      formData.append('area', data.area || '');
      formData.append('state', data.state || '');
      formData.append('city', data.city || '');
      formData.append('pincode', data.pincode || '');
      formData.append('country', data.country || '');
      formData.append('longitude', data.longitude || '');
      formData.append('latitute', data.latitude || '');
      formData.append('purchaseMaterialIds', '');
      formData.append('itemCarryText', '');
      formData.append('tutorFirstName', data.firstName || '');
      formData.append('tutorLastName', data.lastName || '');
      formData.append('tutorEmailID', data.email || '');
      formData.append('tutorCountryCode', '+91');
      formData.append('tutorPhoneNo', data.phoneNumber || '');
      formData.append('whatsappCountryCode', '+91');
      formData.append('whatsappNo', data.whatsappNumber || '');
      formData.append('tutorIntro', data.contactIntroduction || '');
      formData.append('website', '');
      formData.append('classLevel', '');
      formData.append('instagramAcc', '');
      formData.append('youtubeAcc', '');
      formData.append('createdDate', new Date().toISOString());
      formData.append('modifiedDate', new Date().toISOString());

      // Call vendor activity creation API with FormData
      const response = await createVendorActivity(formData);

      if (response) {
        setCompletedSections(prev => ({ ...prev, instituteDetails: true }));
        setActiveAccordion("item-2");
        toast.success("Institute details saved successfully!");
      } else {
        toast.error("Failed to save institute details. Please try again.");
      }
    } catch (error) {
      console.error("Error saving institute details:", error);
      toast.error("An error occurred while saving institute details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save additional info to API
  const saveAdditionalInfo = async (data: any) => {
    try {
      setIsLoading(true);

      // Get vendor ID from localStorage
      const vendorResponse = localStorage.getItem('vendorResponse');
      if (!vendorResponse) {
        throw new Error('Vendor ID not found');
      }

      const { vendorId } = JSON.parse(vendorResponse);

      // Create FormData object
      const formData = new FormData();
      
      // Add required fields
      formData.append('vendorId', vendorId.toString());
      formData.append('type', 'INSTITUTE');
      formData.append('title', data.websiteName || 'Default Title');
      
      // Add thumbnail image - make sure we're sending the actual File object
      if (images && images.length > 0 && images[0] instanceof File) {
        formData.append('thumbnailImageFile', images[0], images[0].name);
      } else {
        toast.error('Please upload at least one valid image file');
        return;
      }

      // Add additional info fields
      formData.append('website', data.websiteName || '');
      formData.append('classLevel', data.classLevel || '');
      formData.append('instagramAcc', data.instagramAccount || '');
      formData.append('youtubeAcc', data.youtubeAccount || '');

      // Call vendor activity creation API
      const response = await createVendorActivity(formData);

      if (response) {
        setCompletedSections(prev => ({ ...prev, additionalInfo: true }));
        toast.success("Additional information saved successfully!");
      } else {
        toast.error("Failed to save additional information. Please try again.");
      }
    } catch (error) {
      console.error("Error saving additional information:", error);
      toast.error("An error occurred while saving additional information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save class details to localStorage
  const saveClassDetails = async (data: any) => {
    try {
      setIsLoading(true);

      // Prepare vendor class data
      const classData = {
        id: 0,
        vendorId: parseInt(vendorId),
        activityId: 0, // This should be the activity ID from the previous API call
        subCategoryID: data.subCategory,
        title: data.className,
        timingsFrom: data.time.split('-')[0].trim(),
        timingsTo: data.time.split('-')[1].trim(),
        day: data.weekdays.join(','),
        type: "REGULAR",
        ageFrom: parseInt(data.fromage),
        ageTo: parseInt(data.toage),
        sessionFrom: 1,
        sessionTo: parseInt(data.noOfSessions),
        gender: data.gender,
        price: parseInt(data.cost)
      };

      // Call vendor class creation API
      const response = await createVendorClass([classData]);

      if (response) {
        const updatedClasses = [...courses, { ...data }];
        setCourses(updatedClasses);
        localStorage.setItem('classDetails', JSON.stringify(updatedClasses));
        setCompletedSections(prev => ({ ...prev, classDetails: true }));
        toast.success("Class details saved successfully!");

        // Reset form fields
        setValueClass('className', '');
        setValueClass('category', '');
        setValueClass('subCategory', '');
        setValueClass('location', '');
        setValueClass('contact', '');
        setValueClass('time', '');
        setValueClass('gender', '');
        setValueClass('fromage', '');
        setValueClass('toage', '');
        setValueClass('fromcost', '');
        setValueClass('tocost', '');
        setValueClass('cost', '');
        setValueClass('classSize', '');
        setValueClass('weekdays', []);
        setValueClass('experienceLevel', '');
        setValueClass('noOfSessions', '');
        setShowClassFields(false);
      } else {
        toast.error("Failed to create vendor class. Please try again.");
      }
    } catch (error) {
      console.error("Error saving class details:", error);
      toast.error("An error occurred while saving class details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveCourseDetails = (data: any) => {
    const selectedAddress = locations.find((item) => item.area === data.location);
    const selectedContact = contacts.find(
      (item) => item.firstName + " " + item.lastName === data.contact
    );

    const newDirectoryItem: DirectoryItem = {
      address: selectedAddress?.area || "",
      isPrimary: selectedContact?.contactType.primary ? 'Yes' : 'No',
      firstName: selectedContact?.firstName || "",
      lastName: selectedContact?.lastName || "",
      phoneNumber: selectedContact?.phoneNumber || "",
      whatsappNumber: selectedContact?.whatsappNumber || "",
      email: selectedContact?.email || "",
      contactType: {
        primary: false,
        secondary: false,
        billing: false,
      },
    };

    // Update the directory state
    setDirectory((prev) => [...prev, newDirectoryItem]);

    // Save the directory to localStorage
    localStorage.setItem("directory", JSON.stringify([...directory, newDirectoryItem]));
    
    // Update courses state directly
    setCourses(prev => [...prev, { ...data }]);
    localStorage.setItem('corseDetails', JSON.stringify([...courses, { ...data }]));
    
    setCompletedSections(prev => ({ ...prev, classDetails: true }));
    toast.success("Course details saved successfully!");
    
    // Reset form fields
    setValueCourse('className', '');
    setValueCourse('category', '');
    setValueCourse('subCategory', '');
    setValueCourse('location', '');
    setValueCourse('contact', '');
    setValueCourse('time', '');
    setValueCourse('gender', '');
    setValueCourse('fromage', '');
    setValueCourse('toage', '');
    setValueCourse('fromcost', '');
    setValueCourse('tocost', '');
    setValueCourse('cost', '');
    setValueCourse('classSize', '');
    setValueCourse('weekdays', []);
    setValueCourse('experienceLevel', '');
    setValueCourse('noOfSessions', '');
    setShowCourseFields(false);
  };

  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true);

      // Get all form data
      const personalDetails = watchPersonal();
      const instituteDetails = watchInstitute();
      const additionalInfo = watchAdditionalInfo();

      // Create FormData object
      const formData = new FormData();

      // Add required fields
      formData.append('vendorId', vendorId.toString());
      formData.append('type', 'INSTITUTE');
      formData.append('title', instituteDetails.programTitle);
      
      // Add thumbnail image - make sure we're sending the actual File object
      if (images && images.length > 0 && images[0] instanceof File) {
        formData.append('thumbnailImageFile', images[0], images[0].name);
      } else {
        toast.error('Please upload at least one valid image file');
        return;
      }

      // Add institute details
      formData.append('companyName', instituteDetails.instituteName || '');
      formData.append('description', instituteDetails.introduction || '');
      formData.append('sinceYear', instituteDetails.since || '');
      formData.append('gstNo', instituteDetails.gstNo || '');
      formData.append('address', instituteDetails.address || '');
      formData.append('road', '');
      formData.append('area', instituteDetails.area || '');
      formData.append('state', instituteDetails.state || '');
      formData.append('city', instituteDetails.city || '');
      formData.append('pincode', instituteDetails.pincode || '');
      formData.append('country', instituteDetails.country || '');
      formData.append('longitude', (instituteDetails.longitude || '').toString());
      formData.append('latitute', (instituteDetails.latitude || '').toString());

      // Add tutor details
      formData.append('tutorFirstName', personalDetails.name.split(' ')[0] || '');
      formData.append('tutorLastName', personalDetails.name.split(' ').slice(1).join(' ') || '');
      formData.append('tutorEmailID', personalDetails.emailId || '');
      formData.append('tutorCountryCode', '+91');
      formData.append('tutorPhoneNo', personalDetails.phoneNumber || '');
      formData.append('whatsappCountryCode', '+91');
      formData.append('whatsappNo', personalDetails.phoneNumber || '');
      formData.append('tutorIntro', instituteDetails.introduction || '');

      // Add additional info
      formData.append('website', additionalInfo.websiteName || '');
      formData.append('classLevel', additionalInfo.classLevel || '');
      formData.append('instagramAcc', additionalInfo.instagramAccount || '');
      formData.append('youtubeAcc', additionalInfo.youtubeAccount || '');

      // Log the FormData contents for debugging
      for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Create vendor activity
      const activityResponse = await createVendorActivity(formData);

      if (activityResponse) {
        // Create vendor classes
        const classPromises = courses.map(classData => {
          const vendorClassData = {
            id: 0,
            vendorId: parseInt(vendorId),
            activityId: activityResponse.id,
            subCategoryID: classData.subCategory,
            title: classData.className,
            timingsFrom: classData.time.split('-')[0].trim(),
            timingsTo: classData.time.split('-')[1].trim(),
            day: classData.weekdays.join(','),
            type: "REGULAR",
            ageFrom: parseInt(classData.fromage),
            ageTo: parseInt(classData.toage),
            sessionFrom: 1,
            sessionTo: parseInt(classData.noOfSessions),
            gender: classData.gender,
            price: parseInt(classData.cost)
          };
          return createVendorClass([vendorClassData]);
        });

        await Promise.all(classPromises);

        setIsSuccessPopupOpen(true);
        toast.success("Registration completed successfully!");
      } else {
        toast.error("Failed to create vendor activity. Please try again.");
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

  const handleEditClass = (index: number) => {
    setEditIndex(index); // Set the index of the class being edited
    const classToEdit = courses[index];
    console.log(editIndex)
    setActiveAccordion("item-4");
    Object.keys(classToEdit).forEach((key) => {
      setValueClass(key as keyof typeof classDetailsSchema.fields, classToEdit[key]);
    });
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
    if (value === activeAccordion && !completedSections[value as keyof typeof completedSections]) {
      toast.error("Complete the form first!");
      return;
    }
    // Allow opening only completed sections
    if (value === activeAccordion) {
      setActiveAccordion(""); // Close the accordion
      return;
    }

    if (
      (value === "item-0") || // Personal Details can always be opened
      (value === "item-1" && completedSections.personalDetails) || // Institute Details depends on Personal Details
      (value === "item-2" && completedSections.instituteDetails) || // Additional Info depends on Institute Details
      (value === "item-4" && completedSections.additionalInfo) || // Class Details depends on Additional Info
      (value === "item-5" && completedSections.additionalInfo) // Course Details depends on Additional Info
    ) {
      setActiveAccordion(value); // Allow opening the accordion
    } else {
      toast.error("Please complete the previous sections first!"); // Show an error message
    }

  }

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
                  </div>
                  <Button
                    type="submit"
                    className="my-4 w-20% app-bg-color text-white float-right"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Next"}
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
                <form onSubmit={handleSubmitInstitute(saveInstituteDetails)}>
                  <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                        Program Title<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Program Title"
                        {...registerInstitute("programTitle")}
                        className="h-[52px] border-[#05244f]"
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
                        className="h-[52px] border-[#05244f]"
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

                  <div className="mb-6 mt-[50px]">
                    <h3 className="text-[#05244f] trajan-pro text-md font-semibold">Photos<span className="text-red-500 ml-1 text-sm">*</span></h3>
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
                                // Remove both the File and its preview URL
                                const updatedImages = images.filter((_, i) => i !== index);
                                const updatedUrls = imageUrls.filter((_, i) => i !== index);
                                setImages(updatedImages);
                                setImageUrls(updatedUrls);
                                // Update localStorage
                                localStorage.setItem('imageMetadata', JSON.stringify(updatedImages.map(file => ({
                                  name: file.name,
                                  type: file.type,
                                  size: file.size
                                }))));
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

                    {(isInstDetailsSubmitted && images.length == 0) && <div className="text-red-500 text-sm mb-2">At least one image is required</div>}
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
                        <Button variant="outline" className="">Browse File</Button>
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

                  <div className="flex flex-col gap-2 mb-6">
                    <Label className="w-[177px] text-black text-[11.6px] font-semibold">Introduction</Label>
                    <Textarea
                      placeholder="Introduction"
                      rows={5}
                      {...registerInstitute("introduction")}
                      className="rounded-[15px] h-[120px] border-[#05244f]"
                    />
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
                            {...registerInstitute("whatsappNumber")}
                            className="h-[52px] border-[#05244f]"
                          />
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
                      type="submit"
                      className="app-bg-color text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save and Continue"}
                    </Button>
                  </div>
                </form>
              </AccordionContent>
            </div>
          </AccordionItem>


          {/* Additional Information Section */}
          <AccordionItem value="item-2">
            <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-2 px-8 mb-3">
              <AccordionTrigger onClick={() => onAccordianClick("item-2")}>
                <div className={`text-[#05244f] text-md trajan-pro font-bold mb-2 flex items-center ${completedSections.additionalInfo || activeAccordion == 'item-2' ? "accordian-trigger-active" : "accordian-trigger-inactive"} `}>
                  Additional information
                  {completedSections.additionalInfo && <CircleCheckBig className="text-[#46a758] ml-2" />}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <form onSubmit={handleSubmitAdditional(saveAdditionalInfo)}>
                  <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Website Name</Label>
                      <Input
                        placeholder="Website Name"
                        {...registerAdditional("websiteName")}
                        className="h-[52px] border-[#05244f]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Class Level</Label>
                      <Input
                        placeholder="Class Level"
                        {...registerAdditional("classLevel")}
                        className="h-[52px] border-[#05244f]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">Instagram Account</Label>
                      <Input
                        placeholder="Instagram Account"
                        {...registerAdditional("instagramAccount")}
                        className="h-[52px] border-[#05244f]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="w-[177px] text-black text-[11.6px] font-semibold">YouTube Account</Label>
                      <Input
                        placeholder="YouTube Account"
                        {...registerAdditional("youtubeAccount")}
                        className="h-[52px] border-[#05244f]"
                      />
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
                      type="submit"
                      className="app-bg-color text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Additional Info"}
                    </Button>
                  </div>
                </form>
              </AccordionContent>
            </div>
          </AccordionItem>

          {/* Class Details Button */}
          {completedSections.additionalInfo && <Button
            variant="outline"
            className="border-[#05244f] mt-4"
            onClick={() => setIsOpen(true)}
          >
            + Add Class Details
          </Button>}

          <PopupScreen
            open={isOpen}
            setOpen={setIsOpen}
            setShowClassFields={setShowClassFields}
            setShowCourseFields={setShowCourseFields}
            setAccordianOpen={setActiveAccordion}
          />

          {/* Class Details Section */}
          {showClassFields && (
            <AccordionItem value="item-4" >
              <div className="bg-white rounded-[15px] border border-[#05244f] py-2 px-8 my-4">
                <AccordionTrigger onClick={() => setActiveAccordion('item-4')}>
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

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mb-6">
                      {/* <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Location<span className="text-red-500">*</span>
                        </Label>
                        <Select value={watchClass("location") || ""} onValueChange={(value) => setValueClass("location", value)}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations!.map((item) => (<SelectItem key={item.id} value={item.area}>{item.area}</SelectItem>))}

                            <div className="p-2 border-t border-gray-200">
                              <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setIsLocationPopupOpen(true)}
                              >
                                + Add New Location
                              </Button>
                            </div>
                          </SelectContent>
                        </Select>
                        {errorsClass.location && (
                          <p className="text-red-500 text-xs">{errorsClass.location.message}</p>
                        )}
                      </div> */}

                      {/* <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Contact<span className="text-red-500">*
                          </span>
                        </Label>
                        <Select onValueChange={(value) => setValueClass("contact", value)} value={watchClass("contact") || ""}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Contact" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {contacts!.map((item) => (<SelectItem key={item.id} value={item.firstName + ' ' + item.lastName}>{item.firstName} {item.lastName}</SelectItem>))}
                            </SelectGroup>
                            <div className="p-2 border-t border-gray-200">
                              <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setIsContactPopupOpen(true)}
                              >
                                + Add Contact
                              </Button>
                            </div>
                          </SelectContent>
                        </Select>
                        {errorsClass.contact && (
                          <p className="text-red-500 text-xs">{errorsClass.contact.message}</p>
                        )}
                      </div> */}




                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">No. of Sessions</Label>
                        <Input type="number" {...registerClass("noOfSessions")} min="1" defaultValue="1" placeholder="Enter number of sessions" className="h-[52px] border-[#05244f]" />
                      </div>
                      <CostRangeInput
                        form={classForm}
                        setValue={setValueClass}
                        errors={errorsClass}
                      />



                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Time<span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(value) => setValueClass("time", value)} value={watchClass("time") || ""}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                          </SelectContent>
                        </Select>
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
                  <form onSubmit={handleSubmitCourse(saveCourseDetails)}>
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Course Name<span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="Class Name"
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
                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Location<span className="text-red-500">*</span>
                        </Label>
                        <Select value={watchCourse("location") || ""} onValueChange={(value) => setValueCourse("location", value)}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations!.map((item) => (<SelectItem key={item.id} value={item.area}>{item.area}</SelectItem>))}
                            <div className="p-2 border-t border-gray-200">
                              <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setIsLocationPopupOpen(true)}
                              >
                                + Add New Location
                              </Button>
                            </div>
                          </SelectContent>
                        </Select>
                        {errorsCourse.location && (
                          <p className="text-red-500 text-xs">{errorsCourse.location.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Contact<span className="text-red-500">*
                          </span>
                        </Label>
                        <Select onValueChange={(value) => setValueCourse("contact", value)} value={watchCourse("contact") || ""}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Contact" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {contacts!.map((item) => (<SelectItem key={item.id} value={item.firstName + ' ' + item.lastName}>{item.firstName} {item.lastName}</SelectItem>))}
                            </SelectGroup>
                            <div className="p-2 border-t border-gray-200">
                              <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setIsContactPopupOpen(true)}
                              >
                                + Add Contact
                              </Button>
                            </div>
                          </SelectContent>
                        </Select>
                        {errorsCourse.contact && (
                          <p className="text-red-500 text-xs">{errorsCourse.contact.message}</p>
                        )}
                      </div>

                      <LocationPopupScreen open={isLocationPopupOpen} setOpen={setIsLocationPopupOpen}
                        onLocationSubmit={handleLocationSubmit} />
                      <ContactPopupScreen open={isContactPopupOpen} setOpen={setIsContactPopupOpen}
                        onContactSubmit={handleContactSubmit} />



                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">No. of Sessions</Label>
                        <Input type="number" {...registerCourse("noOfSessions")} min="1" defaultValue="1" placeholder="Enter number of sessions" className="h-[52px] border-[#05244f]" />
                      </div>
                      <CostRangeInput
                        form={courseForm}
                        setValue={setValueCourse}
                        errors={errorsCourse}
                      />

                      <div className="flex flex-col gap-2">
                        <Label className="w-[177px] text-black text-[11.6px] font-semibold">
                          Time<span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(value) => setValueCourse("time", value)} value={watchCourse("time") || ""}>
                          <SelectTrigger className="w-full h-[52px] border-[#05244f]">
                            <SelectValue placeholder="Time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                          </SelectContent>
                        </Select>
                        {errorsCourse.time && (
                          <p className="text-red-500 text-xs">{errorsCourse.time.message}</p>
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
                              onChange={() => handleWeekdayChange(day, false)}
                              checked={(watchCourse('weekdays') || []).includes(day)}
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

                        <AgeRangeInput
                          form={classForm}
                          setValue={setValueClass}
                          errors={errorsClass}
                        />

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
        {courses.length > 0 && <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-4 px-8 my-4">
          <div className="text-[#05244f] text-md trajan-pro font-bold my-4">Classes</div>
          <div className="bg-[#fcfcfd] rounded-[15px] outline-1 outline-offset-[-1px] p-4 outline-black">
            <ClassTable classes={courses} handleDelete={handleDeleteClass} handleEdit={handleEditClass} />
            <Button variant="outline" className="border-[#05244f] mt-4" onClick={() => setIsOpen(true)}>+ Add More Details</Button>
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
            // handleEditAddress={(index) => {
            //   // Handle address editing logic here
            // }}
            // handleEditContact={(index) => {
            //   // Handle contact editing logic here
            // }}
            />
            <div className="flex justify-between w-[50%]">
              <Button variant="outline" className="border-[#05244f] mt-4" onClick={() => setIsLocationPopupOpen(true)}>+ Add Address</Button>
              <Button variant="outline" className="border-[#05244f] mt-4" onClick={() => setIsContactPopupOpen(true)}>+ Add Contact</Button>
            </div>
          </div>

        </div>
        }
        {/* Success Popup */}
        <SuccessPopupScreen
          open={isSuccessPopupOpen}
          setOpen={setIsSuccessPopupOpen}
          vendorId={vendorId}
        />

        {/* Final Submit Button */}
        <Button
          onClick={handleFinalSubmit}
          className="my-4 w-20% app-bg-color text-white float-right"
          disabled={isLoading || !completedSections.personalDetails}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
      <LocationPopupScreen open={isLocationPopupOpen} setOpen={setIsLocationPopupOpen}
        onLocationSubmit={handleLocationSubmit} />
      <ContactPopupScreen
        open={isContactPopupOpen}
        setOpen={setIsContactPopupOpen}
        onContactSubmit={handleContactSubmit}
      />

    </>
  );
}


// Types
// interface FormData {
//   name: string;
//   emailId: string;
//   phoneNumber: string;
//   gender?: string;
//   dob?: string;
//   password?: string;
//   confirmPassword?: string;
//   programTitle?: string;
//   instituteName?: string;
//   since?: string;
//   gstNo?: string;
//   introduction?: string;
//   websiteName?: string;
//   classLevel?: string;
//   instagramAccount?: string;
//   youtubeAccount?: string;
//   className?: string;
//   category?: string;
//   subCategory?: string;
//   location?: string;
//   contact?: string;
//   time?: string;
//   experienceLevel?: string;
//   classSize?: string;
//   age?: string;
// }