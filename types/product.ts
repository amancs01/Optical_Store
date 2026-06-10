export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  category: string | null;
  gender: string | null;
  frame_type: string | null;
  shape: string | null;
  material: string | null;
  color: string | null;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string | null;
  images?: ProductImage[];
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  selectedColor?: string | null;
};
