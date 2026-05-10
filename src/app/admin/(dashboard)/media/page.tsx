"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface MediaItem {
  name: string;
  url: string;
  size: number;
  modified: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    const res = await fetch("/api/media");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    setError("");
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        setError(`Skipped non-image: ${file.name}`);
        continue;
      }
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    }
    setUploading(false);
    fetchMedia();
  }

  async function deleteFile(name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    await fetch(`/api/media?file=${encodeURIComponent(name)}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.name !== name));
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 2000);
  }

  const filtered = items.filter((i) => {
    if (!search) return true;
    return i.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#111827]">Media Library</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 h-10 inline-flex items-center rounded-lg bg-[#ED7606] text-white text-sm font-bold hover:bg-[#D46900] disabled:opacity-50 transition-colors"
        >
          {uploading ? "Uploading..." : "+ Upload"}
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">{error}</div>}

      <input
        className="w-full h-10 px-3 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#ED7606] mb-4"
        placeholder="Search files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />

      {/* Drop zone */}
      <div
        className={`mb-6 p-8 border-2 border-dashed rounded-xl text-center transition-colors ${dragOver ? "border-[#ED7606] bg-[#FFF1E3]" : "border-[#E5E7EB] bg-[#F8F9FA]"}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files); }}
      >
        <p className="text-sm text-[#9CA3AF]">Drag and drop images here, or click Upload</p>
      </div>

      {loading ? (
        <p className="text-center text-sm text-[#9CA3AF] py-8">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-[#9CA3AF] py-8">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="group relative rounded-xl border border-[#E5E7EB] bg-white overflow-hidden hover:border-[#ED7606]/50 hover:shadow-md transition-all"
            >
              <div className="aspect-square bg-[#F8F9FA] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239CA3AF'><path d='M0 0h24v24H0z' fill='none'/><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg>"; }}
                />
              </div>
              <div className="p-2">
                <p className="text-[10px] text-[#6B7280] truncate" title={item.name}>{item.name}</p>
                <p className="text-[10px] text-[#9CA3AF]">{formatBytes(item.size)}</p>
              </div>

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="w-9 h-9 rounded-lg bg-white text-[10px] font-bold text-[#374151] shadow-lg hover:bg-[#ED7606] hover:text-white transition-colors"
                  title="Copy URL"
                >
                  {copied === item.url ? "OK" : "URL"}
                </button>
                <button
                  onClick={() => deleteFile(item.name)}
                  className="w-9 h-9 rounded-lg bg-white text-[10px] font-bold text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-colors"
                  title="Delete"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
