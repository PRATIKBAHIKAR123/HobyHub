

export default function ConditionsPage() {
    const content = {title: "Terms & Conditions", content: `
Terms of Service



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
}
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">{content.title}</h1>
                <pre className="whitespace-pre-wrap text-base text-gray-800 leading-relaxed">{content.content}</pre>
            </div>
        </div>
            )
}