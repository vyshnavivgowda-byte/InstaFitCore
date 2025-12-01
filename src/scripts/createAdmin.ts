import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // loads .env.local automatically

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createAdmin() {
  const email = "admininstafit@example.com"; // your admin email
  const password = "Admin@123";             // strong password

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { role: "admin" },
  });

  if (error) {
    console.error("Error creating admin:", error);
  } else {
    console.log("Admin user created:", data);
  }
}

createAdmin();
