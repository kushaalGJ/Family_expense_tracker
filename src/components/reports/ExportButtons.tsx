"use client";

import { FileText, FileSpreadsheet, Download } from "lucide-react";
import type { Database } from "@/lib/types/database.types";

type Expense = Database["public"]["Tables"]["expenses"]["Row"];

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const HEADERS = ["Date", "Category", "Note", "Payment", "Amount"] as const;
const toRow = (e: Expense) => [
  e.date,
  e.category,
  e.note || "",
  e.payment_method || "",
  e.amount,
];

export function ExportButtons({ rows, label }: { rows: Expense[]; label: string }) {
  async function exportPdf() {
    const { jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("FamilySpend Report", 14, 18);
    doc.setFontSize(10);
    doc.text(label, 14, 25);
    autoTable(doc, {
      startY: 30,
      head: [HEADERS as unknown as string[]],
      body: rows.map((e) => toRow(e).map(String)),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [29, 185, 84] },
    });
    doc.save("familyspend-report.pdf");
  }

  async function exportExcel() {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Expenses");
    ws.addRow(HEADERS as unknown as string[]);
    ws.getRow(1).font = { bold: true };
    rows.forEach((e) => ws.addRow(toRow(e)));
    ws.columns.forEach((c) => (c.width = 18));
    const buf = await wb.xlsx.writeBuffer();
    downloadBlob(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "familyspend-report.xlsx"
    );
  }

  function exportCsv() {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      HEADERS.join(","),
      ...rows.map((e) => toRow(e).map((v) => esc(String(v))).join(",")),
    ];
    downloadBlob(new Blob([lines.join("\n")], { type: "text/csv" }), "familyspend-report.csv");
  }

  const btn =
    "flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[rgb(var(--card-border))] bg-[rgb(var(--card))] py-3 text-sm font-semibold hover:bg-black/[0.02] dark:border-white/10 dark:hover:bg-white/5";

  return (
    <div className="flex gap-2">
      <button type="button" onClick={exportPdf} className={btn}>
        <FileText size={16} className="text-[rgb(var(--expense))]" /> PDF
      </button>
      <button type="button" onClick={exportExcel} className={btn}>
        <FileSpreadsheet size={16} className="text-[rgb(var(--income))]" /> Excel
      </button>
      <button type="button" onClick={exportCsv} className={btn}>
        <Download size={16} className="text-[rgb(var(--savings))]" /> CSV
      </button>
    </div>
  );
}
