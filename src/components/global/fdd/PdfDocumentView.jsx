import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Loader from "../../shared/Loader";

// the worker must be set in the same module that renders the pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const PAGE_WIDTH = 620;

// every page of the file, children render an overlay on the page they are given
const PdfDocumentView = ({ file, width = PAGE_WIDTH, onLoad, children, className = "" }) => {
  const [pageCount, setPageCount] = useState(0);

  const handleLoad = ({ numPages }) => {
    setPageCount(numPages);
    onLoad?.(numPages);
  };

  return (
    <Document
      file={file}
      onLoadSuccess={handleLoad}
      loading={<Loader className="min-h-40!" />}
      error={<p className="p-6 text-center text-sm text-remove">This document could not be opened.</p>}
      className={`flex flex-col items-center gap-4 ${className}`}
    >
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
        <div key={pageNumber} className="relative w-fit shadow-sm">
          <Page pageNumber={pageNumber} width={width} renderAnnotationLayer={false} renderTextLayer={false} />
          {children?.(pageNumber)}
        </div>
      ))}
    </Document>
  );
};

export default PdfDocumentView;
