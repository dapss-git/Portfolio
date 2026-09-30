"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, UploadIcon, CheckIcon, CopyIcon, DownloadIcon } from "../Icons";

// ─── Types ────────────────────────────────────────────────────────────────────
type UploadStatus = "idle" | "dragging" | "uploading" | "success" | "error";

interface UploadResult {
  file_name: string;
  file_size: string;
  file_type: string;
  file_id: string;
  file_path: string;
  direct_media_url: string;
}

const BOT_TOKEN = "8860804193:AAFbpvZGiIC-mtMMx1ugfZtJYVWbQXKROAA";
const CHAT_ID = "8136654727";

const ALLOWED_EXTENSIONS = [
  ".jpg", ".jpeg", ".png", ".gif", ".webp",
  ".mp4", ".mov",
  ".mp3", ".ogg", ".wav",
  ".pdf", ".zip", ".txt", ".doc", ".docx", ".xls", ".xlsx",
];

const MAX_SIZE_MB = 50;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(typeOrName: string): string {
  const lower = typeOrName.toLowerCase();
  if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/) || lower.startsWith("image/")) return "🖼️";
  if (lower.match(/\.(mp4|mov)$/) || lower.startsWith("video/")) return "🎬";
  if (lower.match(/\.(mp3|wav|ogg)$/) || lower.startsWith("audio/")) return "🎵";
  if (lower.endsWith(".pdf") || lower === "application/pdf") return "📄";
  if (lower.endsWith(".zip") || lower.includes("zip")) return "🗜️";
  if (lower.match(/\.(doc|docx)$/) || lower.includes("word")) return "📝";
  if (lower.match(/\.(xls|xlsx)$/) || lower.includes("excel") || lower.includes("sheet")) return "📊";
  return "📁";
}

export default function UploaderPage() {
  const [viewMode, setViewMode] = useState<{ path: string; name: string } | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check URL query parameters for ?view=path & ?name=filename
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view");
      const nameParam = params.get("name");
      if (viewParam) {
        setViewMode({
          path: viewParam,
          name: nameParam || viewParam.split("/").pop() || "file",
        });
      }
    }
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File terlalu besar! Maksimal ${MAX_SIZE_MB} MB. File kamu: ${formatBytes(file.size)}`;
    }
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Format file tidak didukung. Gunakan: ${ALLOWED_EXTENSIONS.join(", ")}`;
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const err = validateFile(file);
    if (err) {
      setErrorMsg(err);
      setStatus("error");
      return;
    }
    setSelectedFile(file);
    setStatus("idle");
    setErrorMsg("");
    setResult(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setStatus("idle");
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setStatus("dragging");
  };

  const handleDragLeave = () => {
    setStatus("idle");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setStatus("uploading");
    setProgress(0);
    setErrorMsg("");

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 88 ? prev + Math.random() * 12 : prev));
    }, 300);

    try {
      const isPhoto = selectedFile.type.startsWith("image/") && selectedFile.type !== "image/gif";
      const isAudio = selectedFile.type.startsWith("audio/");
      const isVideo = selectedFile.type.startsWith("video/");

      let endpoint = "sendDocument";
      let fieldName = "document";

      if (isPhoto) {
        endpoint = "sendPhoto";
        fieldName = "photo";
      } else if (isAudio) {
        endpoint = "sendAudio";
        fieldName = "audio";
      } else if (isVideo) {
        endpoint = "sendVideo";
        fieldName = "video";
      }

      const tgFormData = new FormData();
      tgFormData.append("chat_id", CHAT_ID);
      tgFormData.append("caption", `📁 Upload: ${selectedFile.name} (${formatBytes(selectedFile.size)})`);
      tgFormData.append(fieldName, selectedFile, selectedFile.name);

      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`, {
        method: "POST",
        body: tgFormData,
      });

      const tgData = await tgRes.json();

      if (!tgRes.ok || !tgData.ok) {
        throw new Error(tgData?.description || "Gagal mengunggah file.");
      }

      const msg = tgData.result;
      const fileId: string =
        msg?.photo?.[msg.photo.length - 1]?.file_id ||
        msg?.document?.file_id ||
        msg?.audio?.file_id ||
        msg?.video?.file_id ||
        "";

      let filePath = "";
      if (fileId) {
        try {
          const getFileRes = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
          );
          const getFileData = await getFileRes.json();
          if (getFileData.ok && getFileData.result?.file_path) {
            filePath = getFileData.result.file_path;
          }
        } catch {}
      }

      // Dynamic origin supports daps.my.id, portfolio.daps.my.id, or any custom domain
      const currentOrigin =
        typeof window !== "undefined" ? window.location.origin : "https://daps.my.id";

      const directMediaUrl = filePath ? `${currentOrigin}/f/${filePath}` : "";

      const uploadResult: UploadResult = {
        file_name: selectedFile.name,
        file_size: formatBytes(selectedFile.size),
        file_type: selectedFile.type || "file",
        file_id: fileId,
        file_path: filePath,
        direct_media_url: directMediaUrl,
      };

      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setResult(uploadResult);
        setStatus("success");
      }, 300);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const msg = err instanceof Error ? err.message : "Upload gagal.";
      setErrorMsg(msg);
      setStatus("error");
      setProgress(0);
    }
  };

  const handleCopy = () => {
    if (!result?.direct_media_url) return;
    navigator.clipboard.writeText(result.direct_media_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadViewedFile = async () => {
    if (!viewMode) return;
    setIsDownloading(true);
    const rawUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${viewMode.path}`;
    try {
      const res = await fetch(rawUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = viewMode.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(rawUrl, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const resetAll = () => {
    setStatus("idle");
    setSelectedFile(null);
    setProgress(0);
    setResult(null);
    setErrorMsg("");
    setCopied(false);
    setViewMode(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/uploader");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── FILE VIEWER MODE (?view=path) ──────────────────────────────────────────
  if (viewMode) {
    const isImg = viewMode.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) || viewMode.path.includes("photos");
    const isAudio = viewMode.name.match(/\.(mp3|wav|ogg)$/i) || viewMode.path.includes("music");
    const isVid = viewMode.name.match(/\.(mp4|mov)$/i) || viewMode.path.includes("videos");
    const rawTelegramUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${viewMode.path}`;

    return (
      <main className="min-h-screen py-8 px-4 flex flex-col items-center bg-[var(--bg-main)] font-mono text-[var(--text-main)]">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-black">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[var(--card-bg)] font-black text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
            <span className="font-black text-sm uppercase">FILE VIEWER</span>
          </div>

          <div className="bg-[var(--card-bg)] border-3 sm:border-4 border-black shadow-[8px_8px_0px_#000] p-6 flex flex-col items-center gap-5 text-center">
            {isImg && (
              <div className="w-full max-h-72 border-3 border-black overflow-hidden bg-white shadow-[4px_4px_0px_#000] flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={rawTelegramUrl}
                  alt={viewMode.name}
                  className="w-full h-full object-contain max-h-64"
                />
              </div>
            )}

            {isAudio && (
              <div className="w-full p-4 bg-[var(--bg-main)] border-2 border-black">
                <audio controls src={rawTelegramUrl} className="w-full h-10 border border-black" />
              </div>
            )}

            {isVid && (
              <div className="w-full border-3 border-black overflow-hidden bg-black shadow-[4px_4px_0px_#000]">
                <video controls src={rawTelegramUrl} className="w-full max-h-64" />
              </div>
            )}

            <div className="w-full bg-[var(--bg-main)] border-2 border-black p-4 text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getFileIcon(viewMode.name)}</span>
                <p className="text-xs font-black uppercase truncate text-[var(--text-main)]">
                  {viewMode.name}
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadViewedFile}
              disabled={isDownloading}
              className="w-full py-4 bg-[#00ff66] text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <DownloadIcon className="w-5 h-5 stroke-[2.5]" />
              <span>{isDownloading ? "Mengunduh File..." : "Unduh File Sekarang"}</span>
            </button>

            <button
              onClick={resetAll}
              className="w-full py-3 bg-[var(--card-bg)] text-[var(--text-main)] font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Upload File Lainnya →
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── MAIN UPLOADER INTERFACE ────────────────────────────────────────────────
  return (
    <main className="min-h-screen py-8 px-4 flex flex-col items-center bg-[var(--bg-main)] font-mono text-[var(--text-main)]">
      <div className="w-full max-w-lg">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8 pb-3 border-b-2 border-black">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[var(--card-bg)] text-[var(--text-main)] text-xs font-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black px-2 py-0.5 bg-[#00ff66] text-black border border-black shadow-[1px_1px_0px_#000]">
              UPLOADER
            </span>
            <span className="font-black text-sm uppercase tracking-wider">
              DAPS
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block px-3 py-1 bg-[#FFE135] text-black border-2 border-black shadow-[2px_2px_0px_#000] text-xs font-black uppercase mb-3">
            UPLOAD FILE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2">
            Upload File
          </h1>
          <p className="text-xs opacity-70">
            Pilih atau seret file kamu · Maksimal {MAX_SIZE_MB} MB
          </p>
        </div>

        {/* ─── SUCCESS STATE ───────────────────────────────────────── */}
        {status === "success" && result ? (
          <div className="bg-[var(--card-bg)] border-3 sm:border-4 border-black shadow-[6px_6px_0px_#000] p-6 flex flex-col items-center gap-5 text-center">
            {/* Success Checkmark */}
            <div className="w-16 h-16 bg-[#00ff66] border-3 border-black flex items-center justify-center shadow-[4px_4px_0px_#000]">
              <CheckIcon className="w-9 h-9 text-black stroke-[3]" />
            </div>

            <div>
              <p className="text-xl font-black uppercase">
                File Berhasil Diupload!
              </p>
              <p className="text-xs opacity-70 mt-1">
                {result.file_name} ({result.file_size})
              </p>
            </div>

            {/* ─── SINGLE RESULT URL + COPY BUTTON ─── */}
            <div className="w-full flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={result.direct_media_url}
                className="flex-1 bg-white dark:bg-[#18181f] text-black dark:text-white border-2 border-black px-3.5 py-3 text-xs font-bold truncate select-all focus:outline-none shadow-[2px_2px_0px_#000]"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-3 bg-[#FFE135] text-black border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-4 h-4 stroke-[3]" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4 stroke-[2.5]" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {/* ─── UPLOAD FILE LAINNYA BUTTON ─── */}
            <button
              onClick={resetAll}
              style={{ backgroundColor: "var(--accent-primary)" }}
              className="w-full py-3.5 text-black font-black text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              Upload File Lainnya →
            </button>
          </div>
        ) : (
          /* ─── MAIN UPLOAD FORM ──────────────────────────────────── */
          <div className="bg-[var(--card-bg)] border-3 border-black shadow-[6px_6px_0px_#000] p-6 flex flex-col gap-5">
            {/* Terminal header bar */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-black">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 border border-black bg-[#ff5555] inline-block" />
                <span className="w-3 h-3 border border-black bg-[#FFE135] inline-block" />
                <span className="w-3 h-3 border border-black bg-[#00ff66] inline-block" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider">
                UPLOADER.SYS
              </span>
            </div>

            {/* Drop zone */}
            <div>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-3 border-dashed p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all select-none ${
                  status === "dragging"
                    ? "border-black bg-[#FFE135]/20 scale-[1.01]"
                    : selectedFile
                    ? "border-[#00ff66] bg-[#00ff66]/5"
                    : "border-black bg-[var(--bg-main)] hover:bg-[var(--card-bg)]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_EXTENSIONS.join(",")}
                  onChange={handleInputChange}
                  disabled={status === "uploading"}
                />

                {selectedFile ? (
                  <>
                    <span className="text-4xl">{getFileIcon(selectedFile.name)}</span>
                    <div className="text-center">
                      <p className="text-sm font-black max-w-xs truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs opacity-60 mt-0.5">
                        {formatBytes(selectedFile.size)}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#00ff66] border border-[#00ff66] px-2 py-0.5">
                      SIAP UPLOAD · KLIK UNTUK GANTI
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 border-2 border-black bg-[#FFE135] flex items-center justify-center shadow-[3px_3px_0px_#000]">
                      <UploadIcon className="w-7 h-7 text-black" />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-sm uppercase">
                        Seret file ke sini
                      </p>
                      <p className="text-xs opacity-60 mt-1">
                        atau klik untuk pilih dari galeri / dokumen
                      </p>
                    </div>
                    <p className="text-[10px] text-center opacity-50">
                      Foto · Video · Musik · PDF · Word · Excel · ZIP (Maks {MAX_SIZE_MB} MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div className="p-3 bg-[#ff5555] text-white border-2 border-black text-xs font-bold shadow-[2px_2px_0px_#000]">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Upload progress */}
            {status === "uploading" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black uppercase animate-pulse">
                    Mengunggah file...
                  </span>
                  <span className="text-xs font-black">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-4 bg-[var(--bg-main)] border-2 border-black overflow-hidden p-0.5">
                  <div
                    className="h-full bg-[#00f0ff] border border-black transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || status === "uploading"}
              style={
                selectedFile && status !== "uploading"
                  ? { backgroundColor: "var(--accent-primary)" }
                  : undefined
              }
              className={`w-full py-4 font-black uppercase tracking-wider text-sm border-2 border-black transition-all ${
                status === "uploading"
                  ? "bg-[#FFE135] text-black opacity-80 cursor-wait shadow-[2px_2px_0px_#000]"
                  : selectedFile
                  ? "text-black shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  : "bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed shadow-[2px_2px_0px_#000]"
              }`}
            >
              {status === "uploading" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent animate-spin" />
                  Mengunggah...
                </span>
              ) : (
                `Upload File →`
              )}
            </button>
          </div>
        )}

        {/* Info section */}
        <div className="mt-6 bg-[var(--card-bg)] border-2 border-black p-4 shadow-[3px_3px_0px_#000]">
          <p className="text-xs font-black uppercase mb-2">
            Format yang didukung:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { icon: "🖼️", label: "Gambar (JPG, PNG, GIF, WebP)" },
              { icon: "🎬", label: "Video (MP4, MOV)" },
              { icon: "🎵", label: "Audio (MP3, WAV)" },
              { icon: "📄", label: "PDF" },
              { icon: "📝", label: "Word & Excel" },
              { icon: "🗜️", label: "ZIP" },
            ].map((t) => (
              <span
                key={t.label}
                className="text-[10px] font-bold px-2 py-1 bg-[var(--bg-main)] border border-black"
              >
                {t.icon} {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
