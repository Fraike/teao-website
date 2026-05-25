"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLOR_PROPS = [
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "box-shadow",
  "text-decoration-color",
];

function resolveColors(el: HTMLElement) {
  const computed = window.getComputedStyle(el);
  COLOR_PROPS.forEach((prop) => {
    const val = computed.getPropertyValue(prop);
    if (val && val !== "rgba(0, 0, 0, 0)" && val !== "transparent") {
      el.style.setProperty(prop, val, "important");
    }
  });
  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement) resolveColors(child);
  });
}

export function DownloadPDFButton({ model }: { model: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;

      const source = document.getElementById("product-detail-content");
      if (!source) return;

      // Clone and strip header/footer
      const clone = source.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("nav, header, [data-print-hide]").forEach((el) => el.remove());

      // Strip share buttons & action buttons
      clone.querySelectorAll("a.btn, button").forEach((el) => {
        const target = (el as HTMLElement).dataset?.analyticsTargetId;
        if (target === "download_pdf" || target === "request_quotation") el.remove();
      });

      // Resolve oklch/oklab colors to RGB via computed styles
      resolveColors(clone);

      // Off-screen render
      clone.style.position = "fixed";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = "900px";
      clone.style.zIndex = "-1";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 900,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${model}-TEAO.pdf`);
    } catch (err) {
      console.error("PDF failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={loading}
      data-analytics-event="cta_click"
      data-analytics-target-type="cta"
      data-analytics-target-id="download_pdf"
      data-analytics-source="product_detail"
    >
      <FileDown size={16} className="mr-1.5" />
      {loading ? "Generating..." : "Download PDF"}
    </Button>
  );
}
