"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  List,
  Folder,
  Layers,
  LogOut,
  MessageCircle,
  ClipboardCheck,
  ClipboardList,
  MapPin,
  Briefcase,
} from "lucide-react";

interface SubMenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface MenuItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  children?: SubMenuItem[];
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const menu: MenuItem[] = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
    {
      name: "Listing",
      icon: <List size={18} />,
      children: [
        { name: "Category", path: "/admin/listing/category", icon: <Folder size={16} /> },
        { name: "Subcategory", path: "/admin/listing/subcategory", icon: <Folder size={16} /> },
        { name: "Service", path: "/admin/listing/service", icon: <Layers size={16} /> },
      ],
    },
    { name: "Bookings", path: "/admin/bookings", icon: <ClipboardCheck size={18} /> },
    { name: "Service Requests", path: "/admin/allservicesrequest", icon: <ClipboardList size={18} /> },
    { name: "Our Project", path: "/admin/our-project", icon: <Briefcase size={18} /> },
    { name: "Reviews", path: "/admin/reviews", icon: <MessageCircle size={18} /> },
    { name: "Careers", path: "/admin/admincarrer", icon: <Folder size={18} /> },
    { name: "Pincodes", path: "/admin/pincodes", icon: <MapPin size={18} /> },
  ];

  const renderMenu = (items: MenuItem[]) =>
    items.map((item) => (
      <div key={item.name} className="mb-0.5">
        {!item.children ? (
          <Link
            href={item.path!}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${pathname === item.path
                ? "bg-white text-gray-900 shadow-md"
                : "hover:bg-gray-700 text-gray-300"
              }
            `}
          >
            {item.icon}
            {item.name}
          </Link>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-3 px-4 py-1.5 text-gray-400 font-semibold text-[10px] uppercase tracking-wider">
              {item.icon}
              {item.name}
            </div>
            <div className="ml-4 flex flex-col border-l border-gray-700">
              {item.children.map((sub: SubMenuItem) => (
                <Link
                  key={sub.path}
                  href={sub.path}
                  className={`
                    flex items-center gap-2 px-4 py-1 text-xs transition-all
                    ${pathname === sub.path
                      ? "text-white font-bold"
                      : "text-gray-400 hover:text-white hover:translate-x-1"
                    }
                  `}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    ));

  return (
    <aside className="w-60 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-4 flex flex-col h-screen sticky top-0 overflow-hidden shadow-2xl">
      
      {/* Increased Logo Section */}
      <div className="mb-2 flex flex-col items-center">
        <img
          src="/footerinstlogo.png"
          alt="Instafit Core"
          className="h-20 w-auto object-contain drop-shadow-md" // ✅ Increased from h-12 to h-20
        />
        <h2 className="text-xl font-bold tracking-tight text-white mt-1">
          Admin Panel
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 border-t border-gray-700 pt-3">
        {renderMenu(menu)}
      </nav>

      {/* Logout Button */}
      <button
        onClick={() => {
          document.cookie =
            "admin_logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/login";
        }}
        className="mt-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-lg active:scale-95"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}