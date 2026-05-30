"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ImageIcon, Upload, X, Search, Film, Play, Folder } from "lucide-react";

interface MediaItem {
  name: string;
  url: string;
  size: number;
  modified: string;
  source: "project" | "uploads";
}

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  accept?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  compact?: boolean; // hide trigger, only show modal when open=true
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function isVideo(name: string) {
  return /\.(mp4|webm|mov|avi|mkv)$/i.test(name);
}

export default function MediaPicker({ value, onChange, label, placeholder, accept = "image/*,video/mp4,video/webm,video/quicktime", open: controlledOpen, onOpenChange: controlledOnOpenChange, compact }: MediaPickerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (v: boolean) => {
    if (isControlled) controlledOnOpenChange?.(v);
    else setInternalOpen(v);
  };
  const [tab, setTab] = useState<"upload" | "library">("library");
  const [library, setLibrary] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "project" | "uploads">("all");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media library when tab opens
  const fetchLibrary = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (sourceFilter !== "all") params.set("source", sourceFilter);
      const res = await fetch(`/api/media?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        // Filter based on accept prop
        const items: MediaItem[] = data.filter((item: MediaItem) => {
          const name = item.name.toLowerCase();
          if (accept.includes("video") && isVideo(name)) return true;
          if (accept.includes("image") && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name)) return true;
          return false;
        });
        setLibrary(items);
      }
    } catch {
      // silently fail
    }
  }, [accept, sourceFilter]);

  useEffect(() => {
    if (open) {
      fetchLibrary();
      setTab("library");
      setError("");
    }
  }, [open, fetchLibrary]);

  // Upload new file
  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
      const data = await res.json();
      onChange(data.url);
      setOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
    setUploading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const filtered = library.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const hasValue = value && value.length > 0;
  const isValueVideo = hasValue && isVideo(value);

  return (
    <>
      {/* Trigger (hidden in compact mode) */}
      {!compact && (
        <div>
          {label && <label className="block text-xs font-bold text-[#374151] mb-1">{label}</label>}
          <div className="flex gap-2 items-start">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex-1 min-w-0 flex items-center gap-2 h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm text-left hover:border-[#ED7606] transition-colors bg-white"
              title={value || placeholder || "Select media"}
            >
              {hasValue ? (
                <span className="truncate text-[#374151]">{value}</span>
              ) : (
                <span className="text-[#9CA3AF]">{placeholder || "Click to select image or video..."}</span>
              )}
            </button>
            {hasValue && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="shrink-0 w-8 h-10 rounded-lg border border-red-200 text-red-500 text-sm font-bold hover:bg-red-50"
              >
                &times;
              </button>
            )}
          </div>
          {/* Preview thumbnail */}
          {hasValue && (
            <div className="mt-2 relative w-32 h-32 rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F8F9FA]">
              {isValueVideo ? (
                <div className="w-full h-full flex items-center justify-center bg-[#111827]">
                  <Play size={28} className="text-white/70" />
                </div>
              ) : (
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] shrink-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTab("upload")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    tab === "upload" ? "bg-[#ED7606] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"
                  }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setTab("library")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    tab === "library" ? "bg-[#ED7606] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"
                  }`}
                >
                  Library
                </button>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>
              )}

              {/* Upload Tab */}
              {tab === "upload" && (
                <div>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                      dragOver ? "border-[#ED7606] bg-[#FFF7ED]" : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#FFF1E3] flex items-center justify-center">
                        <Upload size={22} className="text-[#ED7606]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#374151]">
                          {uploading ? "Uploading..." : "Drop file here or click to browse"}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          Supported: JPG, PNG, GIF, WebP, MP4, WebM, MOV (max 5MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 h-9 rounded-lg bg-[#ED7606] text-white text-xs font-bold hover:bg-[#D46900] disabled:opacity-50"
                      >
                        Browse Files
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={accept}
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
              )}

              {/* Library Tab */}
              {tab === "library" && (
                <div>
                  {/* Search + Filter */}
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606]"
                        placeholder="Search files..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <select
                      className="h-10 px-3 rounded-lg border border-[#E5E7EB] text-xs font-bold text-[#374151] bg-white focus:outline-none focus:border-[#ED7606]"
                      value={sourceFilter}
                      onChange={(e) => { setSourceFilter(e.target.value as "all" | "project" | "uploads"); }}
                    >
                      <option value="all">All Sources</option>
                      <option value="project">Project</option>
                      <option value="uploads">Uploads</option>
                    </select>
                  </div>

                  {/* Grid */}
                  {filtered.length === 0 ? (
                    <div className="text-center py-16">
                      <ImageIcon size={36} className="mx-auto text-[#D1D5DB] mb-3" />
                      <p className="text-sm text-[#9CA3AF]">{search ? "No files match your search" : "No media files yet. Upload some first!"}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                      {filtered.map((item) => {
                        const isSelected = value === item.url;
                        const video = isVideo(item.name);
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => { onChange(item.url); setOpen(false); }}
                            className={`relative rounded-xl border-2 overflow-hidden transition-all group ${
                              isSelected
                                ? "border-[#ED7606] ring-2 ring-[#ED7606]/20 shadow-[0_4px_12px_rgba(237,118,6,.15)]"
                                : "border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md"
                            }`}
                          >
                            <div className="aspect-square bg-[#F8F9FA] relative">
                              {video ? (
                                <div className="w-full h-full flex items-center justify-center bg-[#1F2937]">
                                  <Film size={24} className="text-white/60 group-hover:text-white/90 transition-colors" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Play size={20} className="text-white/80 group-hover:scale-110 transition-transform" />
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={item.url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect fill='%23F3F4F6' width='100' height='100'/></svg>"; }}
                                />
                              )}
                              {isSelected && (
                                <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#ED7606] text-white text-[10px] flex items-center justify-center font-bold">
                                  &#10003;
                                </span>
                              )}
                            </div>
                            <div className="px-2 py-1.5">
                              <p className="text-[10px] font-medium text-[#374151] truncate">{item.name}</p>
                              <p className="text-[9px] text-[#9CA3AF]">
                                {item.source === "project" ? (
                                  <span className="inline-flex items-center gap-0.5 text-[#9CA3AF]">
                                    <Folder size={9} />
                                    project
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-0.5 text-[#9CA3AF]">
                                    <Upload size={9} />
                                    upload
                                  </span>
                                )}
                                {" · "}
                                {formatSize(item.size)}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Refresh button */}
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={fetchLibrary}
                      className="text-xs text-[#6B7280] hover:text-[#ED7606] font-medium"
                    >
                      Refresh library
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#E5E7EB] bg-[#F8F9FA] shrink-0">
              <span className="text-[11px] text-[#9CA3AF]">
                {hasValue ? `Selected: ${value}` : "No file selected"}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 h-9 rounded-lg bg-[#ED7606] text-white text-xs font-bold hover:bg-[#D46900]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Standalone modal opener for programmatic use (e.g., RichTextEditor)
export function useMediaPickerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [resolveRef, setResolveRef] = useState<((url: string | null) => void) | null>(null);

  const open = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      setResolveRef(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleSelect = useCallback((url: string) => {
    if (resolveRef) resolveRef(url);
    setIsOpen(false);
    setResolveRef(null);
  }, [resolveRef]);

  const handleClose = useCallback(() => {
    if (resolveRef) resolveRef(null);
    setIsOpen(false);
    setResolveRef(null);
  }, [resolveRef]);

  return { isOpen, open, handleSelect, handleClose };
}
