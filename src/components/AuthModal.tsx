"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase-client";
import { Mail, X, User, Lock, Loader2, Eye, EyeOff } from "lucide-react"; // Added Eye icons
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";

const BRAND_COLOR = "#8ed26b";

type AuthModalProps = {
  showAuth: boolean;
  setShowAuth: (s: boolean) => void;
  initialMode?: "login" | "register";
  onAuthSuccess?: () => void;
};

export default function AuthModal({
  showAuth,
  setShowAuth,
  initialMode = "login",
  onAuthSuccess,
}: AuthModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for visibility

  useEffect(() => {
    setMode(initialMode);
    setShowPassword(false); // Reset visibility when modal opens/changes
  }, [initialMode, showAuth]);

  const closeModal = () => {
    setShowAuth(false);
    setEmail("");
    setPassword("");
    setName("");
    setLoading(false);
    setShowPassword(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast({ title: "Success!", description: "Account created successfully." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Logged in successfully." });
      }

      if (onAuthSuccess) onAuthSuccess();
      router.push("/site");
      closeModal();
      router.refresh();
      
    } catch (err: any) {
      toast({ 
        title: "Authentication Error", 
        description: err.message || "Something went wrong", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showAuth) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
        <button onClick={closeModal} className="absolute right-6 top-6 text-gray-400 hover:text-black">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-8">
          <Image src="/instlogo.png" alt="Logo" width={200} height={80} className="mb-4" />
          <h2 className="text-2xl font-bold">{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-gray-500 text-sm">Enter your details to continue</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={18} />
              <input
                required
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#8ed26b]/50 border border-transparent focus:border-[#8ed26b]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
            <input
              required
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#8ed26b]/50 border border-transparent focus:border-[#8ed26b]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
            <input
              required
              type={showPassword ? "text" : "password"} // Dynamic type
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#8ed26b]/50 border border-transparent focus:border-[#8ed26b]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Eye Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-bold shadow-lg transition-all hover:opacity-90 flex justify-center items-center"
            style={{ backgroundColor: BRAND_COLOR }}
          >
            {loading ? <Loader2 className="animate-spin" /> : mode === "login" ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-sm font-semibold"
            style={{ color: BRAND_COLOR }}
          >
            {mode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}