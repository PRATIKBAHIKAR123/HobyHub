

export default function PolicyPage() {
    const content = {title: "Privacy Policy", content: `
Privacy Policy


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
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">{content.title}</h1>
                <pre className="whitespace-pre-wrap text-base text-gray-800 leading-relaxed">{content.content}</pre>
            </div>
        </div>
            )
}