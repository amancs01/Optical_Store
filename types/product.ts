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
