import ServiceDetailsClient from "./ServiceDetailsClient";
import { supabase } from "@/lib/supabase-client";

type Params = { id: string };

// Static params
export async function generateStaticParams() {
  const { data: services } = await supabase.from("services").select("id");
  if (!services) return [];
  return services.map(service => ({ id: service.id.toString() }));
}

// Server component
export default async function Page({ params }: { params: Params }) {
  const { id } = params;
  const { data: subData } = await supabase.from("subcategories").select("*").eq("id", id).single();
  if (!subData) return <div>Service not found</div>;

  return <ServiceDetailsClient subData={subData} />;
}
