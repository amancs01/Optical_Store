export const SITE_CONFIG = {
  name: "Titan Optical",
  tagline: "Premium eyewear, sunglasses, lenses, and eye care service in Kathmandu.",
  description:
    "Titan Optical is a premium optical store in New Road, Kathmandu, offering eyewear, sunglasses, lenses, and eye-care support.",
  phone: "9808547043",
  phoneDisplay: "+977-9808547043",
  whatsapp: "9808547043",
  email: "watchsunglasses5@gmail.com",
  emailNote: "Business email (temporary)",
  address: "Kichapokhari, New Road, opposite NMB Bank",
  location: "New Road, Kathmandu",
  googleMapsUrl: "https://maps.app.goo.gl/dD8Kcgv6BM1bsj7q6",
  openingHours: "Sun–Fri, 10:00 AM – 7:00 PM",
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
export const FRAME_SHAPES = ["Aviator", "Round", "Rectangle", "Square", "Cat Eye", "Wayfarer"];
export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"];
