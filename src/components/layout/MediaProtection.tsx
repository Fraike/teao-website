"use client";

import { useEffect } from "react";

function isProtectedMediaTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("img, video, picture, canvas, svg"));
}

function selectionContainsMedia() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  for (let i = 0; i < selection.rangeCount; i += 1) {
    const fragment = selection.getRangeAt(i).cloneContents();
    if (fragment.querySelector("img, video, picture, canvas, svg")) return true;
  }

  return false;
}

export function MediaProtection() {
  useEffect(() => {
    const preventIfMedia = (event: Event) => {
      if (!isProtectedMediaTarget(event.target)) return;
      event.preventDefault();
    };

    const preventMediaCopy = (event: ClipboardEvent) => {
      if (!isProtectedMediaTarget(event.target) && !selectionContainsMedia()) return;
      event.preventDefault();
      event.clipboardData?.clearData();
    };

    document.addEventListener("contextmenu", preventIfMedia, true);
    document.addEventListener("dragstart", preventIfMedia, true);
    document.addEventListener("copy", preventMediaCopy, true);
    document.addEventListener("cut", preventMediaCopy, true);

    return () => {
      document.removeEventListener("contextmenu", preventIfMedia, true);
      document.removeEventListener("dragstart", preventIfMedia, true);
      document.removeEventListener("copy", preventMediaCopy, true);
      document.removeEventListener("cut", preventMediaCopy, true);
    };
  }, []);

  return null;
}
