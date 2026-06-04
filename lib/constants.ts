export const SITE_CONFIG = {
  name: "Optical Store",
  description:
    "Premium eyewear, sunglasses, lenses, and eye-checkup booking in Kathmandu.",
  phone: "+977-9800000000",
  email: "hello@opticalstore.com",
  address: "Kathmandu, Nepal",
  location: "Kathmandu, Nepal",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
};

export const CATEGORIES = ["Eyeglasses", "Sunglasses", "Contact Lenses", "Kids Frames"];
export const GENDERS = ["Men", "Women", "Unisex", "Kids"];
export const FRAME_TYPES = ["Full Rim", "Half Rim", "Rimless", "Aviator", "Wayfarer"];
export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"];
