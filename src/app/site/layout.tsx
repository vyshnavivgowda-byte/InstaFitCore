import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <main className="min-h-screen px-6 py-10">{children}</main>
      <Footer />
    </div>
  );
}
