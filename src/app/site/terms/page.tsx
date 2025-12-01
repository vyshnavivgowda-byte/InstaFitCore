"use client";

import {
  ChevronRightIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CreditCardIcon,
  XMarkIcon,
  UserGroupIcon,
  LockClosedIcon,
  EyeIcon,
  HandRaisedIcon,
  LinkIcon,
  ArrowPathIcon,
  QrCodeIcon
} from "@heroicons/react/24/outline";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-8">
          <h1 className="text-4xl font-extrabold text-center mb-2">
            Terms & Conditions & Privacy Policy
          </h1>
          <p className="text-blue-100 text-center text-lg">
            Welcome to InstaFitCore Pvt. Ltd. Please read the following carefully before using our services.
          </p>
        </div>

        <div className="p-8 lg:p-12">
          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">


            {/* Left Side: Terms & Conditions */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Terms & Conditions</h2>

              {/* Section 1 */}
              <section className="flex items-start space-x-4">
                <DocumentTextIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">1. Our Services</h3>
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    We provide on-demand furniture services including:
                  </p>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1 leading-relaxed">
                    <li>Installation and dismantling</li>
                    <li>Furniture repair and polishing</li>
                    <li>Packing and relocation support</li>
                  </ul>
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    All services are performed by trained professionals following company safety and quality standards.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="flex items-start space-x-4">
                <ChevronRightIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2. Bookings</h3>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1 leading-relaxed">
                    <li>Bookings can be made through our website, WhatsApp, or phone.</li>
                    <li>You will receive a booking confirmation via SMS or email.</li>
                    <li>Please provide accurate address and contact details.</li>
                    <li>Time slots depend on technician availability.</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="flex items-start space-x-4">
                <CreditCardIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">3. Charges & Payment</h3>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1 leading-relaxed">
                    <li>Prices include labor only.</li>
                    <li>Packing material: ₹200 per meter + ₹200 per item.</li>
                    <li>Visit Charges: ₹199 if no work is done after inspection.</li>
                    <li>Payments must be made immediately after completion.</li>
                    <li>Taxes (GST) are additional.</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="flex items-start space-x-4">
                <XMarkIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">4. Cancellations & Rescheduling</h3>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1 leading-relaxed">
                    <li>Cancel or reschedule up to 2 hours before the slot.</li>
                    <li>Late cancellations may incur a ₹199 visit charge.</li>
                    <li>We may reschedule due to safety, weather, or operations.</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section className="flex items-start space-x-4">
                <UserGroupIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">5. Customer Responsibilities</h3>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1 leading-relaxed">
                    <li>Ensure safe access to the work area.</li>
                    <li>Remove fragile items before service.</li>
                    <li>Ensure all required furniture parts are available.</li>
                  </ul>
                </div>
              </section>

              {/* Section 6 */}
              <section className="flex items-start space-x-4">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">6. Liability</h3>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1 leading-relaxed">
                    <li>Not liable for manufacturing defects or missing fittings.</li>
                    <li>Not liable for damages due to pre-existing weaknesses.</li>
                    <li>Not responsible for delays caused by third-party factors.</li>
                  </ul>
                </div>
              </section>

              {/* Section 7 */}
              <section className="flex items-start space-x-4">
                <LockClosedIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">7. Privacy & Data Protection</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We collect minimal personal information needed to complete service requests.
                    For complete details, refer to our Privacy Policy on the right.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="flex items-start space-x-4">
                <HandRaisedIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">8. Professional Conduct</h3>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1 leading-relaxed">
                    <li>Our technicians are trained and background-verified.</li>
                    <li>Customers must treat staff respectfully.</li>
                    <li>Misconduct may result in service termination.</li>
                  </ul>
                </div>
              </section>

              {/* Section 9 */}
              <section className="flex items-start space-x-4">
                <EyeIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">9. Intellectual Property</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All website content belongs to InstaFitCore Pvt. Ltd. and cannot be reused without permission.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section className="flex items-start space-x-4">
                <DocumentTextIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">10. Dispute Resolution</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All disputes fall under the jurisdiction of Bangalore, Karnataka, India.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section className="flex items-start space-x-4">
                <ArrowPathIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">11. Updates</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Terms may be updated periodically with a revised date.
                  </p>
                </div>
              </section>
            </div>

            {/* Right Side: Privacy Policy */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Privacy Policy</h2>
              <p className="text-gray-600 text-center mb-6">
                Effective Date: {new Date().toLocaleDateString()}
              </p>

              {/* Section 1 */}
              <section className="flex items-start space-x-4">
                <EyeIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">1. Information We Collect</h3>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1 leading-relaxed">
                    <li>Name, phone, email</li>
                    <li>Address & booking details</li>
                    <li>Payment details (not stored)</li>
                    <li>Device & analytics info</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="flex items-start space-x-4">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2. How We Use Your Information</h3>
                  <ul className="list-disc ml-6 text-gray-700 space-y-1 leading-relaxed">
                    <li>Deliver services</li>
                    <li>Send updates & receipts</li>
                    <li>Improve service experience</li>
                    <li>Legal compliance</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="flex items-start space-x-4">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">3. Data Security</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Your data is stored on encrypted servers and accessed only by authorized staff.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="flex items-start space-x-4">
                <UserGroupIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">4. Sharing of Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Shared only when legally required or necessary for service delivery.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="flex items-start space-x-4">
                <QrCodeIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">5. Cookies</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies to enhance your experience; you may disable them anytime.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="flex items-start space-x-4">
                <HandRaisedIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">6. Your Rights</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You may request data updates or deletion via privacy@instafitcore.com.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section className="flex items-start space-x-4">
                <LinkIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">7. Third-Party Links</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We are not responsible for external sites linked on our platform.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="flex items-start space-x-4">
                <ArrowPathIcon className="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">8. Policy Updates</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Updated versions will be posted here with a new effective date.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 py-6 px-8 text-center">
          <p className="text-gray-600">
            For any questions, contact us at <a href="mailto:support@instafitcore.com" className="text-blue-600 hover:underline">support@instafitcore.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}