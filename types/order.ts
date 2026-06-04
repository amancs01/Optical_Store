export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  city: string | null;
  delivery_address: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  selected_color: string | null;
  created_at: string;
};

export type Booking = {
  id: string;
  name: string;
  phone: string;
  branch: string | null;
  booking_date: string | null;
  booking_time: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
};
