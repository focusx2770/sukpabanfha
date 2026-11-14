import { NextResponse } from "next/server";
import { sendDiscordOrderNotification } from "@/lib/discordNotify";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order, type } = body;

    if (!order) {
      return NextResponse.json({ error: "Missing order payload" }, { status: 400 });
    }

    await sendDiscordOrderNotification(order, type || "new_order");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API notify-discord error:", error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
