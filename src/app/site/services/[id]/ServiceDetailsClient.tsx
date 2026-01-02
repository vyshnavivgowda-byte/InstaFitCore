'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function ServiceDetailsClient({ id }: { id: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    supabase
      .from("subcategories")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setData(data));
  }, [id]);

  if (!data) return <div>Loading service...</div>;

  return <div>{data.name}</div>;
}
