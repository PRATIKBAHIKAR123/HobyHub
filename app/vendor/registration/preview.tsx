import React from 'react';

interface PreviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  personalDetails?: {
    firstName: string;
    lastName: string;
    //name: string;
    emailId: string;
    phoneNumber: string;
    gender: string;
    dob?: string;
  };
  instituteDetails?: {
    programTitle: string;
    instituteName: string;
    since?: string;
    gstNo?: string;
    introduction: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    whatsappNumber?: string;
    email: string;
    address: string;
    road?: string;
    landmark: string;
    area?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    websiteName?: string;
    classLevel?: string;
    instagramAccount?: string;
    youtubeAccount?: string;
  };
  classDetails?: Array<{
    className: string;
    category: string;
    time: string;
    type: string;
    gender: string;
    fromage?: number;
    toage?: number;
    fromcost?: number;
    tocost?: number;
    weekdays?: string[];
    noOfSessions?: number;
    experienceLevel: string;
    location?: {
      address: string;
      road?: string;
      landmark: string;
      area?: string;
      city: string;
      state: string;
      country: string;
      pincode: string;
    };
    contact?: {
      name: string;
      phoneNumber: string;
      whatsappNumber?: string;
      email: string;
    };
  }>;
  courseDetails?: Array<{
    className: string;
    category: string;
    time: string;
    type: string;
    gender: string;
    fromage?: number;
    toage?: number;
    fromcost?: number;
    tocost?: number;
    weekdays?: string[];
    noOfSessions?: number;
    experienceLevel: string;
  }>;
  images?: Array<string | File>;
  onSubmit: () => void;
}

const PreviewPopup: React.FC<PreviewPopupProps> = ({
  isOpen,
  onClose,
  personalDetails,
  instituteDetails,
  classDetails,
  courseDetails,
  images,
  onSubmit
}) => {
  if (!isOpen) return null;

  // Format weekdays array to readable string
  const formatWeekdays = (weekdays: any) => {
    if (!weekdays || !Array.isArray(weekdays)) return 'None';

    const days = weekdays.filter(day => day !== null);
    if (days.length === 0) return 'None';

    return days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ');
  };

  // Format time to readable format
  const formatTime = (time: any) => {
    switch (time) {
      case 'morning': return 'Morning (9:00 AM - 12:00 PM)';
      case 'afternoon': return 'Afternoon (1:00 PM - 4:00 PM)';
      case 'evening': return 'Evening (5:00 PM - 8:00 PM)';
      default: return time;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-11/12 max-w-7xl max-h-[90vh] overflow-auto">
        <div className="sticky z-999 top-0 bg-primary text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold">Review Registration Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Personal Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">Personal Details</h3>
            {personalDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">First Name:</p>
                  <p>{personalDetails.firstName}</p>
                </div>
                <div>
                  <p className="font-medium">Last Name:</p>
                  <p>{personalDetails.lastName}</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p>{personalDetails.emailId}</p>
                </div>
                <div>
                  <p className="font-medium">Phone Number:</p>
                  <p>{personalDetails.phoneNumber}</p>
                </div>
                <div>
                  <p className="font-medium">Gender:</p>
                  <p>{personalDetails.gender}</p>
                </div>
                <div>
                  <p className="font-medium">Date of Birth:</p>
                  <p>{personalDetails.dob ? new Date(personalDetails.dob).toLocaleDateString() : 'Not specified'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No personal details provided.</p>
            )}
          </div>

          {/* Institute Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">Institute Details</h3>
            {instituteDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Program Title:</p>
                  <p>{instituteDetails.programTitle}</p>
                </div>
                <div>
                  <p className="font-medium">Institute Name:</p>
                  <p>{instituteDetails.instituteName}</p>
                </div>
                <div>
                  <p className="font-medium">Since:</p>
                  <p>{instituteDetails.since || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium">GST Number:</p>
                  <p>{instituteDetails.gstNo || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-medium">Introduction:</p>
                  <p className="whitespace-pre-wrap">{instituteDetails.introduction}</p>
                </div>
                <div>
                  <p className="font-medium">Website:</p>
                  <p>{instituteDetails.websiteName || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium">Class Level:</p>
                  <p>{instituteDetails.classLevel || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium">Instagram:</p>
                  <p>{instituteDetails.instagramAccount || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium">YouTube:</p>
                  <p>{instituteDetails.youtubeAccount || 'Not specified'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No institute details provided.</p>
            )}
          </div>

          {/* Institute Images */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">Institute Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images && images.length > 0 ? (
                images.map((image: any, index: number) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image instanceof File ? URL.createObjectURL(image) : image}
                      alt={`Institute image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">No images uploaded.</p>
              )}
            </div>
          </div>

          {/* Classes Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">Classes</h3>
            {classDetails && classDetails.length > 0 ? (
              <div className="space-y-6">
                {classDetails.map((classItem, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">{classItem.className}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="font-medium">Category:</p>
                        <p>{classItem.category}</p>
                      </div>
                      <div>
                        <p className="font-medium">Time:</p>
                        <p>{formatTime(classItem.time)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Type:</p>
                        <p>{classItem.type}</p>
                      </div>
                      <div>
                        <p className="font-medium">Gender:</p>
                        <p>{classItem.gender === 'both' ? 'All Genders' :
                          classItem.gender === 'male' ? 'Male Only' :
                            classItem.gender === 'female' ? 'Female Only' : classItem.gender}</p>
                      </div>
                      <div>
                        <p className="font-medium">Age Range:</p>
                        <p>
                          {classItem.fromage && classItem.toage
                            ? `${classItem.fromage} to ${classItem.toage} years`
                            : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Price Range:</p>
                        <p>
                          {classItem.fromcost && classItem.tocost
                            ? `₹${classItem.fromcost} to ₹${classItem.tocost}`
                            : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Days:</p>
                        <p>{formatWeekdays(classItem.weekdays)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Sessions:</p>
                        <p>{classItem.noOfSessions || '1'}</p>
                      </div>
                      <div>
                        <p className="font-medium">Experience Level:</p>
                        <p>{classItem.experienceLevel === 'beginner' ? 'Beginner' :
                          classItem.experienceLevel === 'intermediate' ? 'Intermediate' :
                            classItem.experienceLevel === 'advanced' ? 'Advanced' :
                              classItem.experienceLevel}</p>
                      </div>
                      <div>
                        <p className="font-medium">Contact Person / Location</p>
                        <span>{classItem.contact?.name} / </span>
                        <span>{classItem.location?.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No classes added.</p>
            )}
          </div>

          {/* Courses Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 pb-2 border-b-2 border-gray-200">Courses</h3>
            {courseDetails && courseDetails.length > 0 ? (
              <div className="space-y-6">
                {courseDetails.map((course: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">{course.className}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="font-medium">Category:</p>
                        <p>{course.category}</p>
                      </div>
                      <div>
                        <p className="font-medium">Time:</p>
                        <p>{formatTime(course.time)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Type:</p>
                        <p>{course.type}</p>
                      </div>
                      <div>
                        <p className="font-medium">Gender:</p>
                        <p>{course.gender === 'both' ? 'All Genders' :
                          course.gender === 'male' ? 'Male Only' :
                            course.gender === 'female' ? 'Female Only' : course.gender}</p>
                      </div>
                      <div>
                        <p className="font-medium">Age Range:</p>
                        <p>
                          {course.fromage && course.toage
                            ? `${course.fromage} to ${course.toage} years`
                            : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Price Range:</p>
                        <p>
                          {course.fromcost && course.tocost
                            ? `₹${course.fromcost} to ₹${course.tocost}`
                            : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Days:</p>
                        <p>{formatWeekdays(course.weekdays)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Sessions:</p>
                        <p>{course.noOfSessions || '1'}</p>
                      </div>
                      <div>
                        <p className="font-medium">Experience Level:</p>
                        <p>{course.experienceLevel === 'beginner' ? 'Beginner' :
                          course.experienceLevel === 'intermediate' ? 'Intermediate' :
                            course.experienceLevel === 'advanced' ? 'Advanced' :
                              course.experienceLevel}</p>
                      </div>
                      <div>
                        <p className="font-medium">Contact Person / Location</p>
                        <span>{course.contact?.tutorFirstName} / </span>
                        <span>{course.location?.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses added.</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={onSubmit}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPopup;