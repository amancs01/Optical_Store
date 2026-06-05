import { generateOrderNumber } from "@/lib/utils";
import { requireSupabase } from "@/lib/supabase/client";
import type { CartItem } from "@/types/product";
import type { Order, OrderItem } from "@/types/order";

export type CheckoutInput = {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  city?: string;
  delivery_address: string;
  notes?: string;
};

export async function createOrder(input: CheckoutInput, items: CartItem[]) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 0;
  const orderPayload = {
    ...input,
    user_id: user?.id || null,
    order_number: generateOrderNumber(),
    payment_method: "Cash on Delivery",
    subtotal,
    delivery_fee: deliveryFee,
    total_amount: subtotal + deliveryFee,
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) throw orderError;

  const itemPayload = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
    selected_color: item.selectedColor || null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemPayload);
  if (itemsError) throw itemsError;

  return order as Order;
}

export async function trackOrder(query: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("track_order", { search_query: query });

  if (error) throw error;
  return (data?.[0] || null) as Order | null;
}

export async function getOrders() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as (Order & { order_items?: OrderItem[] })[];
}

export async function getCustomerOrders(userId: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Order[];
}

export async function getCustomerOrderByNumber(userId: string, orderNumber: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) throw error;
  return data as (Order & { order_items?: OrderItem[] }) | null;
}

export async function updateOrderStatus(id: string, order_status: string) {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("orders")
    .update({ order_status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}
