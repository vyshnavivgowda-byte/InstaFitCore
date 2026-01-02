import ServiceDetailsClient from "./ServiceDetailsClient";

type Params = { params: { id: string } };

// ✅ REQUIRED for static export
export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];
}

export default function Page({ params }: Params) {
  return <ServiceDetailsClient id={params.id} />;
}
