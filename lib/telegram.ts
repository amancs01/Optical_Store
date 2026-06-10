const TELEGRAM_API = "https://api.telegram.org/bot";

function getConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chatId) return null;
  return { token, chatId };
}

async function sendTelegramMessage(text: string) {
  const config = getConfig();
  if (!config) return;

  try {
    await fetch(`${TELEGRAM_API}${config.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text,
        parse_mode: "HTML",
      }),
    });
  } catch {
    // Notification is fire-and-forget — failure must not affect the order/booking
  }
}

export async function sendOrderNotification(order: {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  delivery_address: string;
  city: string | null;
  items: { name: string; quantity: number }[];
}) {
  const itemList = order.items
    .map((i) => `• ${i.name} x${i.quantity}`)
    .join("\n");

  await sendTelegramMessage(
    `<b>🆕 New Order Received!</b>\n\n` +
    `<b>Order #:</b> ${order.order_number}\n` +
    `<b>👤 Name:</b> ${order.customer_name}\n` +
    `<b>📞 Phone:</b> ${order.customer_phone}\n` +
    `<b>📍 Address:</b> ${order.delivery_address}${order.city ? `, ${order.city}` : ""}\n` +
    `<b>💰 Total:</b> NPR ${order.total_amount.toLocaleString("en-NP")}\n\n` +
    `<b>🛒 Items:</b>\n${itemList}`
  );
}

export async function sendBookingNotification(booking: {
  name: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  branch: string | null;
  message: string | null;
}) {
  let text =
    `<b>🆕 New Eye Checkup Booking!</b>\n\n` +
    `<b>👤 Name:</b> ${booking.name}\n` +
    `<b>📞 Phone:</b> ${booking.phone}\n` +
    `<b>📅 Date:</b> ${booking.booking_date}\n` +
    `<b>⏰ Time:</b> ${booking.booking_time}\n` +
    `<b>📍 Branch:</b> ${booking.branch || "Not specified"}`;

  if (booking.message) {
    text += `\n\n<b>💬 Message:</b> ${booking.message}`;
  }

  await sendTelegramMessage(text);
}
