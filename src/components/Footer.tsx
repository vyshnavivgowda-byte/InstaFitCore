"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* --- COMPANY INFO --- */}
        <div>
          <h4 className="text-white text-xl font-semibold mb-4">
            InstaFitCore Pvt. Ltd.
          </h4>
          <p className="text-gray-400 text-sm leading-6">
            Professional furniture installation, dismantling, repair, and
            modular setup services delivered by certified & trained technicians.
          </p>
          <p className="mt-4 text-gray-400 text-sm leading-6">
            We make furniture installation simple, fast, and reliable — for homes and offices.
          </p>
        </div>

        {/* --- QUICK LINKS --- */}
        <div>
          <h5 className="text-white text-lg font-semibold mb-4">Quick Links</h5>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><Link href="/site/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/site/rate-card" className="hover:text-white">Rate Card</Link></li>
            <li><Link href="/site/book" className="hover:text-white">Book Request</Link></li>
            <li><Link href="/site/terms" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link href="/site/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/site/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/site/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        {/* --- SERVICES LIST --- */}
        <div>
          <h5 className="text-white text-lg font-semibold mb-4">Our Services</h5>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>Furniture Installation</li>
            <li>Furniture Dismantling</li>
            <li>Furniture Repair</li>
            <li>Modular Kitchen Installations</li>
            <li>Packing & Relocation Support</li>
            <li>Repair Work (Foam, Locks, Panels, Polishing)</li>
          </ul>
        </div>

        {/* --- CONTACT INFO --- */}
        <div>
          <h5 className="text-white text-lg font-semibold mb-4">Contact</h5>

          <div className="space-y-3 text-sm text-gray-400">
            <p>
              <span className="font-semibold text-gray-200">Customer Support:</span><br />
              Customersupport@instafitcore.com
            </p>

            <p>
              <span className="font-semibold text-gray-200">Grievance:</span><br />
              Grienvance@instafitcore.com
            </p>

            <p>
              <span className="font-semibold text-gray-200">Head Office:</span><br />
              G7 Kemps Green View,<br />
              Ayyappanagar, KR Puram,<br />
              Bangalore
            </p>

            <p>
              <span className="font-semibold text-gray-200">Toll Free No:</span><br />
              Yet to register
            </p>

            <p>
              <span className="font-semibold text-gray-200">Fax:</span><br />
              Yet to register
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 mt-12 pt-6">
        <p className="text-center text-gray-500 text-xs tracking-wide">
          © {new Date().getFullYear()} InstaFitCore Solutions Private Limited. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
