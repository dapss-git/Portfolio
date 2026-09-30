import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8860804193:AAFbpvZGiIC-mtMMx1ugfZtJYVWbQXKROAA";

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  pdf: "application/pdf",
  zip: "application/zip",
  txt: "text/plain; charset=utf-8",
  json: "application/json",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  try {
    const slugArray = params?.slug || [];
    const filePath = slugArray.map(decodeURIComponent).join("/");

    if (!filePath) {
      return NextResponse.json({ error: "File path tidak diberikan." }, { status: 400 });
    }

    // Security: avoid path traversal
    if (filePath.includes("..")) {
      return NextResponse.json({ error: "Path tidak valid." }, { status: 400 });
    }

    // Fetch raw binary from Telegram Bot API
    const tgUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    const tgRes = await fetch(tgUrl);

    if (!tgRes.ok) {
      return NextResponse.json(
        { error: "File tidak ditemukan di server Telegram atau sudah kedaluwarsa." },
        { status: tgRes.status }
      );
    }

    // Determine correct Content-Type
    const ext = filePath.split(".").pop()?.toLowerCase() || "";
    const upstreamType = tgRes.headers.get("content-type");
    const contentType =
      (ext && MIME_TYPES[ext]) ||
      (upstreamType && upstreamType !== "application/octet-stream" ? upstreamType : "application/octet-stream");

    const fileName = filePath.split("/").pop() || "file";
    const buffer = await tgRes.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.byteLength.toString(),
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memproses file";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
