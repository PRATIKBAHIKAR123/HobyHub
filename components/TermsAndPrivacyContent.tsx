import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TermsAndPrivacyContentProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export function TermsAndPrivacyContent({ isOpen, onClose, type }: TermsAndPrivacyContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const content = [
    {
      title: "Terms & Conditions",
      content: `Terms of Service



Effective Date: 01-August-2024



Welcome to hobyhub.com These Terms of Service "Terms" govern your access to and use of our website, hobyhub.com, and any other services or content provided by hobyhub.com collectively, the "Services". By accessing or using our Services, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not use our Services.



1. Acceptance of Terms



By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you are using our Services on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.



2. User Accounts



- Registration: To access certain features of our Services, you may need to create a free account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.

- Responsibility: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.

- Termination: We reserve the right to suspend or terminate your account if we believe that you have violated these Terms or for any other reason at our discretion.



3. Use of Services



- Eligibility: You must be at least 13 years old to use our Services. By using our Services, you represent and warrant that you meet this age requirement.

- Prohibited Activities: You agree not to engage in any of the following prohibited activities:

  - Using our Services for any unlawful purpose or in violation of any applicable laws or regulations.

  - Impersonating any person or entity or falsely stating or misrepresenting your affiliation with any person or entity.

  - Transmitting or distributing any content that is defamatory, obscene, abusive, or otherwise objectionable.

  - Interfering with or disrupting the operation of our Services or servers.



4. Contents



- User-Generated Content: You may be able to post, submit, or share content through our Services "User Content". You retain ownership of any intellectual property rights you hold in your User Content. By posting User Content, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, distribute, and display your User Content in connection with our Services.

- Content Moderation: We may review and remove User Content that we believe violates these Terms or is otherwise objectionable, but we are not obligated to do so.



5. Privacy



Your use of our Services is also governed by our Privacy Policy, which can be found at page footer on our website. By using our Services, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy.



6. Intellectual Property



- Ownership: All content and materials available through our Services, including but not limited to text, graphics, logos, and software, are the property of hobyhub.com or its licensors and are protected by intellectual property laws.

- License: We grant you a limited, non-exclusive, non-transferable license to access and use our Services for personal, non-commercial purposes, subject to these Terms.



7. Disclaimers



Our Services are provided "as is" and "as available" without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that our Services will be uninterrupted, error-free, or completely secure.



8. Limitation of Liability



To the fullest extent permitted by law, hobyhub.com and its affiliates, officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising out of or related to your use of our Services.



9. Changes to Terms



We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on our website. Your continued use of our Services after such changes constitutes your acceptance of the updated Terms.



10. Termination



We reserve the right to terminate or suspend your access to our Services at any time, with or without cause, and with or without notice.



11. Governing Law



These Terms are governed by and construed in accordance with the laws of the state of Maharashtra, India, without regard to its conflict of law principles. Any disputes arising from these Terms or your use of our Services shall be resolved in the courts located in Pune, Maharashtra.



12. Contact Us



If you have any questions about these Terms or our Services, please contact us at:



bk@hobyhub.com

+91 91589 47785



Thank you for using hobyhub.com!`
    },
    {
      title: "Privacy Policy",
      content: `Privacy Policy


Effective Date: 01-Aug-2024


Welcome to hobyhub.com! This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, hobyhub.com, and use our free subscription services collectively, the "Services". By accessing or using our Services, you agree to the terms outlined in this Privacy Policy. If you do not agree with our practices, please do not use our Services.

1. Information We Collect

1.1. Personal Information

When you create a free account or use our Services, we may collect the following personal information:
- Contact Information: Name, email address, and any other information you provide when you register for an account or contact us.
- Profile Information: Username, profile picture, and any other details you choose to include in your profile.

1.2. Usage Data

We may automatically collect information about your use of our Services, including:
- Log Data: IP address, browser type, operating system, referring URLs, and pages visited.
- Usage Data: Information about how you interact with our Services, including access times and features used.

1.3. Cookies and Tracking Technologies

We use cookies and similar tracking technologies to enhance your experience and analyze usage patterns. Cookies are small data files stored on your device. You can manage your cookie preferences through your browser settings.

2. How We Use Your Information

We use the information we collect for the following purposes:
- To Provide and Maintain Services: To operate, improve, and personalize our Services, including customer support.
- To Communicate with You: To send you updates, newsletters, and promotional materials related to our Services you can contact us on email any time to opt-out.
- To Analyze Usage: To understand how our Services are used and to develop new features or services.
- To Ensure Security: To monitor and protect the security of our Services and prevent fraud or abuse.

3. How We Share Your Information

3.1. With Service Providers

We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and email communication. These service providers are contractually obligated to protect your information and use it only for the purposes for which it was disclosed.

3.2. For Legal Purposes

We may disclose your information if required by law or in response to valid legal requests, such as subpoenas or court orders. We may also disclose your information to enforce our Terms of Service or protect the rights, property, or safety of hobyhub.com, its users, or others.

3.3. Business Transfers

In the event of a merger, acquisition, or sale of all or a portion of our business, your information may be transferred to the acquiring entity. We will notify you of any such change in ownership or control of your personal information.

4. Data Security

We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no data transmission over the internet or electronic storage system can be guaranteed to be completely secure. While we strive to protect your information, we cannot guarantee its absolute security.

5. Your Choices

5.1. Access and Update

You can access and update your account information by logging into your account settings. If you need assistance, you can contact us at bk@hobyhub.com.

5.2. Opt-Out

You may opt out of receiving promotional emails from us by following the unsubscribe instructions in those emails. Please note that even if you opt out of promotional communications, we may still send you service-related updates and notifications.

5.3. Cookies

You can manage your cookie preferences through your browser settings. Please note that disabling cookies may affect the functionality of our Services.

6. Childrens Privacy

Our Services are not directed to individuals under the age of 13. We do not knowingly collect or solicit personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.

7. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will post any changes on this page and update the effective date at the top. Your continued use of our Services after any changes constitutes your acceptance of the updated Privacy Policy.

8. Contact Us

If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:


bk@hobyhub.com

+91 91589 47785


Thank you for using hobyhub.com!
`
    }
  ];

   useEffect(() => {
    if (type === 'terms') {
      setDirection('right');
      setCurrentIndex(0);
    } else if (type === 'privacy') {
      setDirection('left');
      setCurrentIndex(1);
    }
  }, [type]);

  const handleNextSlide = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % content.length);
  };

  const handlePrevSlide = () => {
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + content.length) % content.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-[#3E606C]">{content[currentIndex].title}</DialogTitle>
        </DialogHeader>
        
        <div className="relative px-2">
          <div className="flex flex-col items-center">
            <div className="relative w-full">
              <div className="relative flex justify-center overflow-hidden">
                <div
                  className={`transform transition-all duration-500 ease-out ${
                    direction === 'right' ? 'animate-slideLeft' : 
                    direction === 'left' ? 'animate-slideRight' : ''
                  }`}
                  onAnimationEnd={() => setDirection(null)}
                >
                  <div className="whitespace-pre-line text-sm text-gray-700">
                    {content[currentIndex].content}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="transform -translate-x-8 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
                onClick={handlePrevSlide}
              >
                <ChevronLeft className="h-5 w-5 text-[#3E606C]" />
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="transform translate-x-8 bg-white/80 hover:bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center"
                onClick={handleNextSlide}
              >
                <ChevronRight className="h-5 w-5 text-[#3E606C]" />
              </Button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-1">
              {content.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index ? "bg-[#3E606C]" : "bg-[#E4E4E4]"
                  }`}
                  onClick={() => {
                    setDirection(index > currentIndex ? 'right' : 'left');
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 