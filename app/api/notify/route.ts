import { sendBookingNotification, sendOrderNotification } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return Response.json({ ok: false }, { status: 400 });
    }

    if (type === "order") {
      await sendOrderNotification(data);
    } else if (type === "booking") {
      await sendBookingNotification(data);
    } else {
      return Response.json({ ok: false }, { status: 400 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
