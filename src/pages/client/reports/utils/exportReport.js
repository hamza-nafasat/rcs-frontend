import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "../../../../assets/SVGs/LogoCompany.svg";
import { getRecommendation } from "../../../../utils/pipelineScorecard";
import { stageOf } from "../../../../utils/pipelineStage";
import { formatPhone } from "../../../../utils/formatPhone";

const BRAND = "RCS";
const PRIMARY = [249, 115, 22];
const DARK = [15, 15, 15];
const MUTED = [107, 114, 128];

const COLUMNS = [
  "Applicant",
  "Email",
  "Franchise",
  "Territory",
  "Stage",
  "Financial",
  "Experience",
  "Legal",
  "Market",
  "Total",
  "Outcome",
  "Submitted",
];

const score = (value) => (value ?? 0).toFixed(1);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// one application as table cells
const toRow = (row) => [
  row?.applicant?.fullName ?? "—",
  row?.applicant?.email ?? "—",
  row?.franchiseName ?? "—",
  row?.proposedTerritory || "—",
  stageOf(row?.stage).label,
  score(row?.scores?.financial),
  score(row?.scores?.experience),
  score(row?.scores?.legal),
  score(row?.scores?.market),
  score(row?.scores?.total),
  getRecommendation(row?.stage, row?.scores?.total).label,
  row?.createdAt ? formatDate(row.createdAt) : "—",
];

const rangeText = ({ startDate, endDate }) => {
  if (!startDate && !endDate) return "All time";
  if (!endDate) return `From ${formatDate(startDate)}`;
  if (!startDate) return `Up to ${formatDate(endDate)}`;
  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
};

// RCS-Report-2026-09-01-to-2026-09-18
const fileName = ({ startDate, endDate }, extension) => {
  const range = [startDate, endDate].filter(Boolean).join("-to-") || "all-time";
  return `${BRAND}-Report-${range}.${extension}`;
};

const download = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

// quote cells, block formula injection
const csvCell = (value) => {
  const text = String(value ?? "");
  const safe = /^([=@]|[+-][^\d\s])/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

const YES_NO = { Y: "Yes", N: "No" };

const plain = (value) =>
  value == null || value === ""
    ? ""
    : (YES_NO[value] ?? String(value).replace(/_/g, " "));

const isoDate = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

// every field, one column each
const CSV_COLUMNS = [
  ["Applicant", (row) => row?.applicant?.fullName],
  ["Email", (row) => row?.applicant?.email],
  ["Phone", (row) => formatPhone(row?.applicant?.phone)],
  ["City", (row) => row?.applicant?.city],
  ["State", (row) => row?.applicant?.state],
  ["Country", (row) => row?.applicant?.country],
  ["Franchise", (row) => row?.franchiseName],
  ["Proposed Territory", (row) => row?.proposedTerritory],
  ["Stage", (row) => stageOf(row?.stage).label],
  ["Liquid Capital", (row) => row?.liquidCapital],
  ["Net Worth", (row) => row?.netWorth],
  ["Credit Score", (row) => row?.creditScore],
  ["Years Managing", (row) => row?.yearsMgmt],
  ["Food Experience", (row) => plain(row?.foodExp)],
  ["Multi Unit", (row) => plain(row?.multiUnit)],
  ["Bankruptcy", (row) => plain(row?.bankruptcy)],
  ["Litigation", (row) => plain(row?.litigation)],
  ["Criminal Background", (row) => plain(row?.criminal)],
  ["Non Compete", (row) => plain(row?.nonCompete)],
  ["Territory Available", (row) => plain(row?.territoryAvailable)],
  ["Competitive Density", (row) => plain(row?.density)],
  ["Financial Score", (row) => score(row?.scores?.financial)],
  ["Experience Score", (row) => score(row?.scores?.experience)],
  ["Legal Score", (row) => score(row?.scores?.legal)],
  ["Market Score", (row) => score(row?.scores?.market)],
  ["Total Score", (row) => score(row?.scores?.total)],
  ["Outcome", (row) => getRecommendation(row?.stage, row?.scores?.total).label],
  ["Submitted", (row) => isoDate(row?.createdAt)],
  ["Last Updated", (row) => isoDate(row?.updatedAt)],
];

// one header, one row each
const exportReportCsv = ({ report, dates }) => {
  const header = CSV_COLUMNS.map(([label]) => label);
  const rows = (report?.applications ?? []).map((row) =>
    CSV_COLUMNS.map(([, read]) => read(row)),
  );

  const csv = [header, ...rows]
    .map((line) => line.map(csvCell).join(","))
    .join("\r\n");
  // bom keeps excel reading utf8
  download(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    fileName(dates, "csv"),
  );
};

// svg logo to png data
const loadLogo = () =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth * 4;
      canvas.height = image.naturalHeight * 4;
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve({
        data: canvas.toDataURL("image/png"),
        ratio: image.naturalWidth / image.naturalHeight,
      });
    };
    image.onerror = () => resolve(null);
    image.src = logoUrl;
  });

const exportReportPdf = async ({ report, dates, cards, clientName }) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // dark band behind white logo
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 30, pageWidth, 1.2, "F");

  const logo = await loadLogo();
  if (logo) doc.addImage(logo.data, "PNG", margin, 7, 16 * logo.ratio, 16);
  else {
    doc
      .setTextColor(255, 255, 255)
      .setFont("helvetica", "bold")
      .setFontSize(22);
    doc.text(BRAND, margin, 19);
  }

  doc.setTextColor(255, 255, 255).setFont("helvetica", "bold").setFontSize(18);
  doc.text("Pipeline Report", pageWidth - margin, 15, { align: "right" });
  doc
    .setFont("helvetica", "normal")
    .setFontSize(10)
    .setTextColor(209, 213, 219);
  doc.text(`Generated ${formatDate(new Date())}`, pageWidth - margin, 22, {
    align: "right",
  });

  // client and period
  doc
    .setTextColor(...DARK)
    .setFont("helvetica", "bold")
    .setFontSize(13);
  doc.text(clientName ?? "—", margin, 42);
  doc
    .setFont("helvetica", "normal")
    .setFontSize(10)
    .setTextColor(...MUTED);
  doc.text(`Period: ${rangeText(dates)}`, margin, 48);

  // four summary boxes
  const gap = 5;
  const boxWidth =
    (pageWidth - margin * 2 - gap * (cards.length - 1)) / cards.length;
  cards.forEach((card, index) => {
    const x = margin + index * (boxWidth + gap);
    doc.setDrawColor(229, 231, 235).setFillColor(250, 250, 250);
    doc.roundedRect(x, 54, boxWidth, 20, 2, 2, "FD");
    doc.setFillColor(...PRIMARY);
    doc.rect(x, 54, 1.2, 20, "F");
    doc
      .setTextColor(...DARK)
      .setFont("helvetica", "bold")
      .setFontSize(16);
    doc.text(String(report?.totals?.[card.metric] ?? 0), x + 6, 64);
    doc
      .setFont("helvetica", "normal")
      .setFontSize(9)
      .setTextColor(...MUTED);
    doc.text(card.label, x + 6, 70);
  });

  const rows = (report?.applications ?? []).map(toRow);

  autoTable(doc, {
    startY: 82,
    head: [COLUMNS],
    body: rows.length
      ? rows
      : [
          [
            {
              content: "No applicants in this period",
              colSpan: COLUMNS.length,
            },
          ],
        ],
    margin: { left: margin, right: margin, bottom: 18 },
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 2.5,
      textColor: DARK,
      lineColor: [229, 231, 235],
    },
    headStyles: { fillColor: PRIMARY, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles: {
      5: { halign: "right" },
      6: { halign: "right" },
      7: { halign: "right" },
      8: { halign: "right" },
      9: { halign: "right", fontStyle: "bold" },
    },
  });

  // footer on every page
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc
      .setDrawColor(229, 231, 235)
      .line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFontSize(8).setTextColor(...MUTED);
    doc.text(`${BRAND} · Confidential`, margin, pageHeight - 7);
    doc.text(`Page ${page} of ${pages}`, pageWidth - margin, pageHeight - 7, {
      align: "right",
    });
  }

  doc.save(fileName(dates, "pdf"));
};

export { exportReportCsv, exportReportPdf };
