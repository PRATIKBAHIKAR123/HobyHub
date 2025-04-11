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
import { registerVendor } from "@/services/vendorService";
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
    function(value) {
      const { fromage } = this.parent;
      if (!fromage || !value) return true; // Skip validation if either field is empty
      return Number(value) >= Number(fromage);
    }
  ),
  age: yup.string(),
  fromcost: yup.string(),
  tocost: yup.string().test(
    'is-greater-than-fromcost',
    'To cost must be greater than or equal to From cost',
    function(value) {
      const { fromcost } = this.parent;
      if (!fromcost || !value) return true; // Skip validation if either field is empty
      return Number(value) >= Number(fromcost);
    }
  ),
  cost: yup.string(),
  classSize: yup.string(), // Added classSize to the schema
  weekdays: yup.array(), // Added instituteName to the schema
  experienceLevel: yup.string(), // Added experienceLevel to the schema
  noOfSessions: yup.string(), // Added noOfSessions to the schema
});

// Class details form schema
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
    function(value) {
      const { fromage } = this.parent;
      if (!fromage || !value) return true; // Skip validation if either field is empty
      return Number(value) >= Number(fromage);
    }
  ),
  age: yup.string(),
  fromcost: yup.string(),
  tocost: yup.string().test(
    'is-greater-than-fromcost',
    'To cost must be greater than or equal to From cost',
    function(value) {
      const { fromcost } = this.parent;
      if (!fromcost || !value) return true; // Skip validation if either field is empty
      return Number(value) >= Number(fromcost);
    }
  ),
  cost: yup.string(),
  classSize: yup.string(), // Added classSize to the schema
  weekdays: yup.array(), // Added instituteName to the schema
  experienceLevel: yup.string(), // Added experienceLevel to the schema
  noOfSessions: yup.string(), // Added noOfSessions to the schema
});

export default function RegistrationForm() {
  const [images, setImages] = useState<string[]>([]);
  const [isInstDetailsSubmitted, setisInstDetailsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClassFields, setShowClassFields] = useState(false);
  const [showCourseFields, setShowCourseFields] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editIndexforCourse, setEditIndexforCourse] = useState<number | null>(null);
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

  const [classes, setClasses] = useState<any[]>([]);
  const [course, setCourses] = useState<any[]>([]);

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
    if(showCourseFields){
      setActiveAccordion("item-5");
    }
  }, [showCourseFields, setActiveAccordion]);

  // Form for personal details
  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    setValue: setValuePersonal,
    watch: watchPersonal,
    formState: { errors: errorsPersonal },
    //reset: resetPersonal,
  } = useForm({
    resolver: yupResolver(personalDetailsSchema),
    mode: "onChange",
  });

  // Form for institute details
  const {
    register: registerInstitute,
    handleSubmit: handleSubmitInstitute,
    setValue: setValueInstitute,
    formState: { errors: errorsInstitute },
    //reset: resetInstitute,
  } = useForm({
    resolver: yupResolver(instituteDetailsSchema),
    mode: "onChange",
  });

  // Form for additional info
  const {
    register: registerAdditional,
    handleSubmit: handleSubmitAdditional,
    setValue: setValueAdditional,
    //formState: { errors: errorsAdditional },
    //reset: resetAdditional,
  } = useForm({
    resolver: yupResolver(additionalInfoSchema),
    mode: "onChange",
  });

  // Form for class details
  const {
    register: registerClass,
    handleSubmit: handleSubmitClass,
    setValue: setValueClass,
    formState: { errors: errorsClass },
    watch: watchClass,
    reset: resetClass,
    control: controlClass,
  } = useForm({
    resolver: yupResolver(classDetailsSchema),
    mode: "onChange",
  });

  const {
    register: registerCourse,
    handleSubmit: handleSubmitCourse,
    setValue: setValueCourse,
    formState: { errors: errorsCourse },
    control: controlCourse,
    watch: watchCourse,
    reset: resetCourse,
  } = useForm({
    resolver: yupResolver(courseDetailsSchema),
    mode: "onChange",
  });
  // Load saved data from localStorage on component mount
  useEffect(() => {
    // Load personal details
    const savedPersonalDetails = localStorage.getItem('personalDetails');
    if (savedPersonalDetails) {
      const personalData = JSON.parse(savedPersonalDetails);
      Object.keys(personalData).forEach((key) => {
        setValuePersonal(key as keyof typeof personalDetailsSchema.fields, personalData[key]);
      });
      setCompletedSections(prev => ({...prev, personalDetails: true}));
    }

    // Load institute details
    const savedInstituteDetails = localStorage.getItem('instituteDetails');
    if (savedInstituteDetails) {
      const instituteData = JSON.parse(savedInstituteDetails);
      Object.keys(instituteData).forEach((key) => {
        setValueInstitute(key as keyof typeof instituteDetailsSchema.fields, instituteData[key]);
      });
      setCompletedSections(prev => ({...prev, instituteDetails: true}));
    }

    // Load additional info
    const savedAdditionalInfo = localStorage.getItem('additionalInfo');
    if (savedAdditionalInfo) {
      const additionalData = JSON.parse(savedAdditionalInfo);
      Object.keys(additionalData).forEach((key) => {
        setValueAdditional(key as keyof typeof additionalInfoSchema.fields, additionalData[key]);
      });
      setCompletedSections(prev => ({...prev, additionalInfo: true}));
    }

    // Load class details
    const savedClassDetails = localStorage.getItem('classDetails');
    if (savedClassDetails) {
      console.log('savedClassDetails',savedClassDetails)
      const classData = JSON.parse(savedClassDetails);
      console.log('classData',classData)
      setClasses(classData);
      console.log('classes',classes)
      Object.keys(classData).forEach((key) => {
        setValueClass(key as keyof typeof classDetailsSchema.fields, classData[key]);
      });
      setShowClassFields(false);
      // setCompletedSections(prev => ({...prev, classDetails: true}));    
    }

    // Load course details
    const savedCourseDetails = localStorage.getItem('corseDetails');
    if (savedCourseDetails) {
      const courseData = JSON.parse(savedCourseDetails);
      setCourses(courseData);
      Object.keys(courseData).forEach((key) => {
        setValueCourse(key as keyof typeof courseDetailsSchema.fields, courseData[key]);
      });
      setShowCourseFields(false);
      // setCompletedSections(prev => ({...prev, classDetails: true}));    
    }
    // Load saved images
    const savedImages = localStorage.getItem('images');
    if (savedImages) {
      setImages(JSON.parse(savedImages));
    }
  }, [setValuePersonal, setValueInstitute, setValueAdditional, setClasses, setValueClass, setCourses, setValueCourse]);

  useEffect(() => {
    localStorage.setItem("classDetails", JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem("corseDetails", JSON.stringify(course));
  }, [course]);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);


  // Save contacts to localStorage whenever they change
  useEffect(() => {
    try {
      
      localStorage.setItem('contacts', JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts to localStorage:', error);
    }
  }, [contacts]);
  
  // Function to handle new contact submission
  const handleContactSubmit = (contactData: ContactData) => {
    setContacts(prev => [...prev, contactData]);
  };
  
  // Function to handle contact deletion
  // const handleDeleteContact = (id: string) => {
  //   setContacts(prev => prev.filter(contact => contact.id !== id));
  // };

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
          loadContacts();        }
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
    
    // // Function to handle location deletion
    // const handleDeleteLocation = (id: string) => {
    //   setLocations(prev => prev.filter(location => location.id !== id));
    // };
    

  const handleDeleteClass = (index: number) => {
    // Remove the class at the specified index
    const updatedClasses = classes.filter((_, i) => i !== index);
    setClasses(updatedClasses); // Update state
  };

  const handleDeleteCourse = (index: number) => {
    // Remove the class at the specified index
    const updatedClasses = course.filter((_, i) => i !== index);
    setCourses(updatedClasses); // Update state
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((event.target as HTMLInputElement)?.files || []);
    const newImages = files.map((file) => URL.createObjectURL(file as Blob));
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    
    // Save images to localStorage
    localStorage.setItem('images', JSON.stringify(updatedImages));
  };

  // Save personal details to localStorage and proceed to the next section
  const savePersonalDetails = (data: unknown) => {
    localStorage.setItem('personalDetails', JSON.stringify(data));
    setCompletedSections(prev => ({...prev, personalDetails: true}));
    setActiveAccordion("item-1");
    toast.success("Personal details saved successfully!");
  };

  // Save institute details to localStorage and proceed to the next section
  const saveInstituteDetails = (data: unknown) => {
    setisInstDetailsSubmitted(true);
    if (images.length === 0) {
      return;
    }
    // Save images data with institute details
    const instituteData = {
      ...(typeof data === 'object' && data !== null ? data : {}),
      images: images
    };
    localStorage.setItem('instituteDetails', JSON.stringify(instituteData));
    setCompletedSections(prev => ({...prev, instituteDetails: true}));
    setActiveAccordion("item-2");
    toast.success("Institute details saved successfully!");
    setisInstDetailsSubmitted(false);
  };

  // Save additional info to localStorage
  const saveAdditionalInfo = (data: unknown) => {
    localStorage.setItem('additionalInfo', JSON.stringify(data));
    setCompletedSections(prev => ({...prev, additionalInfo: true}));
    toast.success("Additional information saved successfully!");
  };

  // Save class details to localStorage
const saveClassDetails = (data: any) => {
  // Create a new array with the existing classes plus the new one
  const selectedAddress = locations.find((item) => item.area === data.location);
  const selectedContact = contacts.find(
    (item) => item.firstName + " " + item.lastName === data.contact
  );

  const newDirectoryItem: DirectoryItem = {
    address: selectedAddress?.area || "",
    isPrimary: selectedContact?.contactType.primary?'Yes':'No', // Example value, update as needed
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


  const updatedClasses = [
    ...classes,{...data},
  ];
  
  // Update the state
  setClasses(updatedClasses);
  
  // Save to localStorage
  localStorage.setItem('classDetails', JSON.stringify(updatedClasses));
  
  setCompletedSections(prev => ({...prev, classDetails: true}));
  toast.success("Class details saved successfully!");
  
  // Reset the form and hide the class fields
  resetClass();
  setShowClassFields(false);
};


  const saveCourseDetails = (data: any) => {
    const selectedAddress = locations.find((item) => item.area === data.location);
    const selectedContact = contacts.find(
      (item) => item.firstName + " " + item.lastName === data.contact
    );
  
    const newDirectoryItem: DirectoryItem = {
      address: selectedAddress?.area || "",
      isPrimary: selectedContact?.contactType.primary?'Yes':'No', // Example value, update as needed
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
    const updatedClasses = [...course, {...data}];
    localStorage.setItem('corseDetails', JSON.stringify(updatedClasses));
    setCourses(updatedClasses);
    setCompletedSections(prev => ({...prev, classDetails: true}));
    toast.success("Course details saved successfully!");
    resetCourse();
    setShowCourseFields(false);
   // Reset the class form after saving
  };
  // Final form submission - gather all data and submit to API
  const handleFinalSubmit = async () => {
    setIsLoading(true);

    try {
      // Get all data from localStorage
      const personalDetails = JSON.parse(localStorage.getItem('personalDetails') || '{}');
      const instituteDetails = JSON.parse(localStorage.getItem('instituteDetails') || '{}');
      const additionalInfo = JSON.parse(localStorage.getItem('additionalInfo') || '{}');
      const classDetails = JSON.parse(localStorage.getItem('classDetails') || '[]');
      const courseDetails = JSON.parse(localStorage.getItem('corseDetails') || '[]');
      const directory = JSON.parse(localStorage.getItem('directory') || '[]');

      // Validate required fields
      if (!personalDetails.name || !personalDetails.emailId || !personalDetails.phoneNumber || !personalDetails.gender) {
        toast.error("Please complete all required personal details");
        return;
      }

      if (!instituteDetails.programTitle || !instituteDetails.instituteName) {
        toast.error("Please complete all required institute details");
        return;
      }

      // Format the data according to the API requirements
      const formData = {
        personalDetails: {
          name: personalDetails.name,
          emailId: personalDetails.emailId,
          phoneNumber: personalDetails.phoneNumber,
          gender: personalDetails.gender
        },
        instituteDetails: {
          programTitle: instituteDetails.programTitle,
          instituteName: instituteDetails.instituteName,
          since: instituteDetails.since || "",
          gstNo: instituteDetails.gstNo || "",
          introduction: instituteDetails.introduction || "",
          images: instituteDetails.images || []
        },
        additionalInfo: {
          websiteName: additionalInfo.websiteName || "",
          classLevel: additionalInfo.classLevel || "",
          instagramAccount: additionalInfo.instagramAccount || "",
          youtubeAccount: additionalInfo.youtubeAccount || ""
        },
        classDetails: classDetails,
        courseDetails: courseDetails,
        directory: directory
      };

      // Log the data being sent for debugging
      console.log("Sending data to API:", formData);

      // Make the API call
      const response = await fetch('https://api.hobyhub.com/api/1/vendor/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Set the vendor ID from response and show success popup
        setVendorId(data.vendorId || "254893");
        setIsSuccessPopupOpen(true);
        
        // Clear localStorage after successful submission
        localStorage.removeItem('personalDetails');
        localStorage.removeItem('instituteDetails');
        localStorage.removeItem('additionalInfo');
        localStorage.removeItem('classDetails');
        localStorage.removeItem('corseDetails');
        localStorage.removeItem('directory');
        localStorage.removeItem('images');
      } else {
        // Log the error response for debugging
        console.error("API Error Response:", data);
        toast.error(data.message || data.error || "Failed to register vendor. Please check all required fields.");
      }
    } catch (err) {
      console.error("Error during submission:", err);
      toast.error("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeekdayChange = (day: any,isCLassfields: boolean) => {
    const currentWeekdays = isCLassfields?watchClass('weekdays') || []:watchCourse('weekdays') || []; // Get current weekdays value
    
    // If day is already selected, remove it; otherwise, add it
    if(isCLassfields){
      if (currentWeekdays.includes(day)) {
        setValueClass('weekdays', currentWeekdays.filter((d: any) => d !== day));
      } else {
        setValueClass('weekdays', [...currentWeekdays, day]);
      }
    }else{
      if (currentWeekdays.includes(day)) {
        setValueCourse('weekdays', currentWeekdays.filter((d: any) => d !== day));
      } else {
        setValueCourse('weekdays', [...currentWeekdays, day]);
      }
    }
    
  };

  const handleEditClass = (index: number) => {
    setEditIndex(index); // Set the index of the class being edited
    const classToEdit = classes[index];
    console.log(editIndex)
    setActiveAccordion("item-4");
    Object.keys(classToEdit).forEach((key) => {
      setValueClass(key as keyof typeof classDetailsSchema.fields, classToEdit[key as keyof typeof classDetailsSchema.fields]);
    });
    setShowClassFields(true); // Show the class form
  };

  const handleEditCourse = (index: number) => {
    setEditIndexforCourse(index); // Set the index of the class being edited
    const classToEdit = course[index];
    setActiveAccordion("item-5");
    console.log(editIndexforCourse)
    Object.keys(classToEdit).forEach((key) => {
      setValueCourse(key as keyof typeof courseDetailsSchema.fields, classToEdit[key as keyof typeof courseDetailsSchema.fields]);
    });
    setShowCourseFields(true); // Show the class form
  };

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category.title.toString() === watchCourse("category")
    );
  
    if (selectedCategory && selectedCategory.subcategories.length > 0) {
      // Automatically set the first subcategory as the default
      setValueCourse("subCategory", selectedCategory.subcategories[0].id.toString());
    } else {
      // Clear the subCategory if no subcategories are available
      setValueCourse("subCategory", "");
    }
  }, [watchCourse("category"), categories, setValueCourse]);

  useEffect(() => {
    const selectedCategory = categories.find(
      (category) => category.title.toString() === watchClass("category")
    );
  
    if (selectedCategory && selectedCategory.subcategories.length > 0) {
      // Automatically set the first subcategory as the default
      setValueClass("subCategory", selectedCategory.subcategories[0].id.toString());
    } else {
      // Clear the subCategory if no subcategories are available
      setValueClass("subCategory", "");
    }
  }, [watchClass("category"), categories, setValueClass]);

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
          // onValueChange={(value) => {
          //   console.log("Accordion value changed:", value);
          //   // Allow opening only completed sections
          //   if (value === activeAccordion) {
          //     setActiveAccordion(""); // Close the accordion
          //     return;
          //   }
        
          //   if (
          //     (value === "item-0") || // Personal Details can always be opened
          //     (value === "item-1" && completedSections.personalDetails) || // Institute Details depends on Personal Details
          //     (value === "item-2" && completedSections.instituteDetails) || // Additional Info depends on Institute Details
          //     (value === "item-4" && completedSections.additionalInfo) || // Class Details depends on Additional Info
          //     (value === "item-5" && completedSections.additionalInfo) // Course Details depends on Additional Info
          //   ) {
          //     setActiveAccordion(value); // Allow opening the accordion
          //   } else {
          //     toast.error("Please complete the previous sections first!"); // Show an error message
          //   }
          // }}
          collapsible
        >
          {/* Personal Details Section */}
          <AccordionItem value="item-0">
            <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-2 px-8 mb-3">
              <AccordionTrigger onClick={() => onAccordianClick("item-0")}>
                <div className={`text-[#05244f] text-md trajan-pro font-bold mb-2 flex items-center ${completedSections.personalDetails || activeAccordion=='item-0' ? "accordian-trigger-active" : "accordian-trigger-inactive"}`}>
                  Personal Details
                  {completedSections.personalDetails && <CircleCheckBig className="text-[#46a758] ml-2"/>}
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
                          <SelectItem value="Other">Other</SelectItem>
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
              <div className={` text-md trajan-pro font-bold mb-2 flex items-center ${completedSections.instituteDetails ||activeAccordion=='item-1' ? "accordian-trigger-active" : "accordian-trigger-inactive"} "`}>
                  Institute Details
                  {completedSections.instituteDetails && <CircleCheckBig className="text-[#46a758] ml-2"/>}
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
  {images.map((src, index) => (
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
          // Create a new array without the image at this index
          const updatedImages = images.filter((_, i) => i !== index);
          setImages(updatedImages);
          // Update localStorage
          localStorage.setItem('images', JSON.stringify(updatedImages));
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
                    
                   {(isInstDetailsSubmitted && images.length==0) && <div className="text-red-500 text-sm mb-2">At least one image is required</div> }
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
        <AccordionTrigger  onClick={() => onAccordianClick("item-2")}>
          <div className={`text-[#05244f] text-md trajan-pro font-bold mb-2 flex items-center ${completedSections.additionalInfo ||activeAccordion=='item-2' ? "accordian-trigger-active" : "accordian-trigger-inactive"} `}>
            Additional information
            {completedSections.additionalInfo && <CircleCheckBig className="text-[#46a758] ml-2"/>}
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
          setShowCourseFields ={setShowCourseFields}
          setAccordianOpen={setActiveAccordion}
        />
        
        {/* Class Details Section */}
        {showClassFields && (
          <AccordionItem value="item-4" >
          <div className="bg-white rounded-[15px] border border-[#05244f] py-2 px-8 my-4">
          <AccordionTrigger onClick={() => setActiveAccordion('item-4')}>
            <div className="text-[#05244f] text-md font-bold my-4 trajan-pro flex items-center">
              Class Details
              {completedSections.classDetails && <CircleCheckBig className="text-[#46a758] ml-2"/>}
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
                <div className="flex flex-col gap-2">
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
                </div>
                
                <div className="flex flex-col gap-2">
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
                      {contacts!.map((item) => (<SelectItem key={item.id} value={item.firstName+' '+item.lastName}>{item.firstName} {item.lastName}</SelectItem>))}
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
                </div>
                
                
                
              
              <div className="flex flex-col gap-2">
                <Label className="w-[177px] text-black text-[11.6px] font-semibold">No. of Sessions</Label>
                <Input type="number" {...registerClass("noOfSessions")}  min="1" defaultValue="1" placeholder="Enter number of sessions" className="h-[52px] border-[#05244f]" />
              </div>
              <CostRangeInput 
      register={registerClass} 
      control={controlClass} 
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
              onChange={() => handleWeekdayChange(day,true)}
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
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <AgeRangeInput 
      register={registerClass} 
      control={controlClass} 
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
              {completedSections.classDetails && <CircleCheckBig className="text-[#46a758] ml-2"/>}
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
                      {contacts!.map((item) => (<SelectItem key={item.id} value={item.firstName+' '+item.lastName}>{item.firstName} {item.lastName}</SelectItem>))}
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
                <Input type="number" {...registerCourse("noOfSessions")}  min="1" defaultValue="1" placeholder="Enter number of sessions" className="h-[52px] border-[#05244f]" />
              </div>
              <CostRangeInput 
      register={registerCourse} 
      control={controlCourse} 
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
              onChange={() => handleWeekdayChange(day,false)}
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
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <AgeRangeInput 
      register={registerClass} 
      control={controlClass} 
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
{classes.length>0 && <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-4 px-8 my-4">
          <div className="text-[#05244f] text-md trajan-pro font-bold my-4">Classes</div>
          <div className="bg-[#fcfcfd] rounded-[15px] outline-1 outline-offset-[-1px] p-4 outline-black">
            <ClassTable classes={classes} handleDelete={handleDeleteClass} handleEdit={handleEditClass}/>
            <Button variant="outline" className="border-[#05244f] mt-4" onClick={() => setIsOpen(true)}>+ Add More Details</Button>
          </div>
        </div>
}

{course.length>0 && <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-4 px-8 my-4">
          <div className="text-[#05244f] text-md trajan-pro font-bold my-4">Courses</div>
          <div className="bg-[#fcfcfd] rounded-[15px] outline-1 outline-offset-[-1px] p-4 outline-black">
            <ClassTable classes={course} handleDelete={handleDeleteCourse} handleEdit={handleEditCourse}/>
            <Button variant="outline" className="border-[#05244f] mt-4" onClick={() => setIsOpen(true)}>+ Add More Details</Button>
          </div>
        </div>
}
        {/* Directory Section */}
       {directory.length>0&& <div className="bg-white rounded-[15px] border-1 border-[#05244f] py-4 px-8 my-4">
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
          <Button variant="outline" className="border-[#05244f] mt-4"  onClick={() => setIsContactPopupOpen(true)}>+ Add Contact</Button>
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
                onLocationSubmit={handleLocationSubmit}/>
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