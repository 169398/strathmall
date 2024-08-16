import { APP_NAME } from '@/lib/constants';
import React from 'react';
import Footer from './footer';

export const metadata = {
    title: `Privacy policy - ${APP_NAME}`,
  }
const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 p-8">
      {/* Header */}
      <header className="bg-gray-600 text-white p-4 rounded shadow-md">
        <h1 className="text-3xl font-bold">StrathMall Privacy Policy</h1>
      </header>

      {/* Privacy Policy Content */}
      <main className="flex-grow mt-8">
        <div className="bg-white p-6 rounded shadow-lg">
          <p><strong>Effective Date:</strong> [Insert Date]</p>

          <h2 className="text-2xl font-bold mt-6 mb-2">1. Information We Collect</h2>
          <p>
            We collect various types of information to provide and improve our services, including:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>
              <strong>Personal Information:</strong> When you create an account, make a purchase, or contact us, we may collect your name, email address, phone number, payment information, and other relevant details.
            </li>
            <li>
              <strong>Usage Data:</strong> We automatically collect information about how you use StrathMall, such as your IP address, browser type, pages visited, and actions taken on the platform.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience and gather data about website usage.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-2">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Provide and maintain our services.</li>
            <li>Process transactions and send you related information, such as confirmations and invoices.</li>
            <li>Communicate with you, including responding to your inquiries, sending updates, and providing customer support.</li>
            <li>Improve and personalize your experience on StrathMall.</li>
            <li>Analyze usage patterns to enhance our platform&apos;s functionality and performance.</li>
            <li>Comply with legal obligations and protect our rights.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-2">3. Sharing Your Information</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside parties, except:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li>
              <strong>Service Providers:</strong> We may share your data with third-party service providers who assist us in operating our platform and conducting our business.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your information when required to comply with legal obligations, enforce our policies, or protect our rights and the safety of others.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-2">4. Security of Your Information</h2>
          <p>
            We implement a variety of security measures to protect your personal information. However, please note that no method of transmission over the internet or electronic storage is 100% secure. We strive to use commercially acceptable means to protect your data but cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Access and request a copy of the personal information we hold about you.</li>
            <li>Request correction of any inaccurate or incomplete data.</li>
            <li>Request the deletion of your personal information, subject to certain legal obligations.</li>
            <li>Opt-out of receiving marketing communications from us.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-6 mb-2">6. Third-Party Links</h2>
          <p>
            StrathMall may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">7. Children’s Privacy</h2>
          <p>
            StrathMall is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected such information, we will take steps to delete it.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the effective date will be updated accordingly. We encourage you to review this policy periodically to stay informed about how we protect your information.
          </p>

          <h2 className="text-2xl font-bold mt-6 mb-2">9. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or your personal information, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> [Insert Email Address]
            <br />
            <strong>Address:</strong> [Insert Physical Address]
          </p>

          <p className="mt-4">**Thank you for choosing StrathMall. We are committed to protecting your privacy and ensuring a safe and secure experience for all our users.**</p>
        </div>
      </main>

      {/* Footer */}
      <div className="bg-gray-600 text-white p-4">
<Footer/>
     </div>
    </div>
  );
};

export default PrivacyPolicy;
