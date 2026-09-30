import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  "8860804193:AAFbpvZGiIC-mtMMx1ugfZtJYVWbQXKROAA";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "8136654727";

// Maximum file size: 50 MB (Telegram bot API limit)
const MAX_SIZE_BYTES = 50 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "foto",
  "image/png": "foto",
  "image/gif": "foto/gif",
  "image/webp": "foto",
  "video/mp4": "video",
  "video/quicktime": "video",
  "audio/mpeg": "audio",
  "audio/ogg": "audio",
  "audio/wav": "audio",
  "application/pdf": "dokumen PDF",
  "application/zip": "arsip ZIP",
  "application/x-zip-compressed": "arsip ZIP",
  "text/plain": "dokumen teks",
  "application/msword": "dokumen Word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "dokumen Word",
  "application/vnd.ms-excel": "Excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const caption = formData.get("caption") as string | null;
    const uploaderName = formData.get("uploader_name") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang dikirim." }, { status: 400 });
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: `Tipe file "${file.type}" tidak diizinkan.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Ukuran file terlalu besar (maks 50 MB). File kamu: ${formatBytes(file.size)}` },
        { status: 400 }
      );
    }

    const timeStr = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    const fileTypeLabel = ALLOWED_TYPES[file.type];
    const captionText =
      `📁 <b>File Baru Masuk!</b>\n\n` +
      `👤 <b>Pengirim:</b> ${uploaderName ? uploaderName.trim() : "Anonim"}\n` +
      `📄 <b>Nama file:</b> ${file.name}\n` +
      `📂 <b>Tipe:</b> ${fileTypeLabel} (${file.type})\n` +
      `💾 <b>Ukuran:</b> ${formatBytes(file.size)}\n` +
      (caption ? `💬 <b>Keterangan:</b> ${caption.trim()}\n` : "") +
      `📅 <b>Waktu:</b> ${timeStr} WIB\n\n` +
      `🌐 Via daps.my.id/uploader`;

    // Convert File to ArrayBuffer then Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine Telegram send method based on type
    const isPhoto = file.type.startsWith("image/") && file.type !== "image/gif";
    const isAudio = file.type.startsWith("audio/");
    const isVideo = file.type.startsWith("video/");

    let endpoint: string;
    let fieldName: string;

    if (isPhoto) {
      endpoint = "sendPhoto";
      fieldName = "photo";
    } else if (isAudio) {
      endpoint = "sendAudio";
      fieldName = "audio";
    } else if (isVideo) {
      endpoint = "sendVideo";
      fieldName = "video";
    } else {
      endpoint = "sendDocument";
      fieldName = "document";
    }

    // Build multipart/form-data for Telegram
    const tgFormData = new FormData();
    tgFormData.append("chat_id", CHAT_ID);
    tgFormData.append("caption", captionText);
    tgFormData.append("parse_mode", "HTML");
    tgFormData.append(
      fieldName,
      new Blob([buffer], { type: file.type }),
      file.name
    );

    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`,
      {
        method: "POST",
        body: tgFormData,
      }
    );

    const tgData = await tgRes.json();

    if (!tgRes.ok || !tgData.ok) {
      console.error("Telegram upload error:", tgData);
      return NextResponse.json(
        { error: tgData?.description || "Gagal mengirim file ke Telegram." },
        { status: 500 }
      );
    }

    // Extract file_id for reference
    const msg = tgData.result;
    const fileId: string =
      msg?.photo?.[msg.photo.length - 1]?.file_id ||
      msg?.document?.file_id ||
      msg?.audio?.file_id ||
      msg?.video?.file_id ||
      "";

    let fileUrl = "";
    if (fileId) {
      try {
        const getFileRes = await fetch(
          `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
        );
        const getFileData = await getFileRes.json();
        if (getFileData.ok && getFileData.result?.file_path) {
          fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${getFileData.result.file_path}`;
        }
      } catch {}
    }

    return NextResponse.json({
      success: true,
      file_name: file.name,
      file_size: formatBytes(file.size),
      file_type: fileTypeLabel,
      file_id: fileId,
      file_url: fileUrl,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal server error";
    console.error("Upload error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
