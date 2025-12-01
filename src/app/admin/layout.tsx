"use client";

import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 px-6 py-4">
        {children}
      </main>
    
    </div>
  );
}
