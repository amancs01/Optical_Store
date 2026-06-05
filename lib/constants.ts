export const SITE_CONFIG = {
  name: "Titan Opticals",
  tagline: "Premium eyewear, sunglasses, lenses, and eye care service in Kathmandu.",
  description:
    "Titan Opticals is a premium optical store in New Road, Kathmandu, offering eyewear, sunglasses, lenses, and eye-care support.",
  phone: "9802776649",
  phoneDisplay: "+977-9802776649",
  whatsapp: "9802776649",
  email: "watchsunglasses5@gmail.com",
  address: "Kichapokhari, New Road, opposite NMB Bank",
  location: "New Road, Kathmandu",
  openingHours: "10:00 AM - 7:00 PM",
  deliveryNote: "Free delivery inside Kathmandu Valley.",
  defaultCity: "Kathmandu",
  logoPath: "/logo.png",
  socialLinks: {
    facebook: "https://www.facebook.com/profile.php?id=61576994011750",
    instagram: "https://www.instagram.com/titanoptical11/",
    tiktok: "https://www.tiktok.com/@titan.optical?_r=1&_t=ZS-96wGLXeT1cN",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://titanopticals.com",
};

export const CATEGORIES = ["Eyeglasses", "Sunglasses", "Contact Lenses", "Kids Frames"];
export const GENDERS = ["Men", "Women", "Unisex", "Kids"];
export const FRAME_TYPES = ["Full Rim", "Half Rim", "Rimless", "Aviator", "Wayfarer"];
export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"];
