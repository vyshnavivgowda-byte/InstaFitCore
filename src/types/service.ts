// src/types/service.ts
export type ServiceReview = {
  id: number;
  rating: number;
  employee_name: string;
  service_details: string | null;
  created_at: string;
  images: string[] | null;
};

export type ServiceItem = {
  id: number;
  category: string;
  subcategory: string;
  service_name: string;
  [key: string]: any;
  image_url: string | null;
  installation_price: number | null;
  dismantling_price: number | null;
  repair_price: number | null;
};

export type Subcategory = {
  id: number;
  subcategory: string;
  description: string | null;
  image_url: string | null;
  category: string;
};
