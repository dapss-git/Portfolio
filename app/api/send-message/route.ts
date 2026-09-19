import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8860804193:AAFbpvZGiIC-mtMMx1ugfZtJYVWbQXKROAA";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "8136654727";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const rawText = typeof body.text === "string" ? body.text.trim() : "";

    let sendText = "";
    if (name || message) {
      const safeName = escapeHtml(name || "Anonim");
      const safeMessage = escapeHtml(message || rawText || "-");
      const timeStr = new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
      });
      sendText = `📩 <b>Pesan Portfolio Baru!</b>\n\n👤 <b>Nama:</b> ${safeName}\n💬 <b>Pesan:</b>\n${safeMessage}\n\n📅 <b>Waktu:</b> ${timeStr} WIB`;
    } else if (rawText) {
      sendText = escapeHtml(rawText);
    } else {
      return NextResponse.json(
        { error: "Nama dan pesan tidak boleh kosong" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: sendText,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.ok) {
      console.error("Telegram API error:", data);
      return NextResponse.json(
        { error: data?.description || "Gagal mengirim pesan ke Telegram" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    console.error("Send message error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
