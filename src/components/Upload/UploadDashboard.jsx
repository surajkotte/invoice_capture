
const API_URL = import.meta.env.VITE_API_URL;

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Document, Page, pdfjs } from "react-pdf";
import React, { useState, useEffect, useRef } from "react";
import UploadDataView from "./UploadDataView";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const UploadDashboard = ({
  data,
  selectedView,
  fieldsInfo,
  submit,
  handleUploadPrompt,
  setSceTemplate,
  sceTemplate,
}) => {
  const [activeField, setActiveField] = useState(null); // currently selected field
  const [numPages, setNumPages] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [invoiceData, setInvoiceData] = useState({ ...data });
const pageRefs = React.useRef({});

  // Load PDF
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

// Convert absolute px → normalized 0–1
//  function normalizeRect(domRect, pageRect, pdfPage) {
//   if (!pdfPage || !pageRect) return null;

//   // PDF viewport at canonical scale
//   const viewport = pdfPage.getViewport({ scale: 1.0 });

//   // DOM → PDF scale factors
//   const scaleX = viewport.width / pageRect.width;
//   const scaleY = viewport.height / pageRect.height;

//   // Convert DOM px → PDF units
//   const pdfAbs = {
//     top: domRect.top * scaleY,
//     left: domRect.left * scaleX,
//     width: domRect.width * scaleX,
//     height: domRect.height * scaleY,
//   };

//   // Normalize (0–1)
//   return {
//     top: pdfAbs.top / viewport.height,
//     left: pdfAbs.left / viewport.width,
//     width: pdfAbs.width / viewport.width,
//     height: pdfAbs.height / viewport.height,
//   };
// }
function normalizeRect(absRect, pageRect, pdfPage) {
  const viewport = pdfPage.getViewport({ scale: 1 });

  // Scale DOM → PDF
  const scaleX = viewport.width / pageRect.width;
  const scaleY = viewport.height / pageRect.height;

  // Absolute PDF coordinates
  const pdfLeft = absRect.left * scaleX;
  const pdfTop = absRect.top * scaleY;
  const pdfWidth = absRect.width * scaleX;
  const pdfHeight = absRect.height * scaleY;

  // 🔥 Convert top-left → bottom-left
  const pdfBottom = viewport.height - pdfTop - pdfHeight;

  // ✅ Normalize for DB
  return {
    left_pos: pdfLeft / viewport.width,
    bottom_pos: pdfBottom / viewport.height,
    width: pdfWidth / viewport.width,
    height: pdfHeight / viewport.height,
  };
}


const handlePdfClick = (event, pageNumber) => {
  const wrapper = event.target.closest(".pdf-page-wrapper");
  if (!wrapper) return;

   const pageRect = wrapper.getBoundingClientRect();
const pdfPage = pageRefs.current[pageNumber];
if (!pdfPage) return;

const viewport = pdfPage.getViewport({ scale: 1.0 });
  const textSpans = wrapper.querySelectorAll(
    ".react-pdf__Page__textContent span"
  );

  let nearest = null;
  let nearestDist = Infinity;

  const clickX = event.clientX;
  const clickY = event.clientY;

  textSpans.forEach((span) => {
    const r = span.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dist = Math.hypot(cx - clickX, cy - clickY);

    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = { span, rect: r };
    }
  });

  if (!nearest) return;

  const text = nearest.span.textContent.trim();

  // Original rectangle in rendered pixel coords
const pixelRects = getPixelRectsFromClickOrSelection({
  singleRect: nearest.rect,
  wrapperRect: pageRect
});
  // NORMALIZE (0–1)
 const normRects = pixelRects.map(r =>
  normalizeRect(r, pageRect, pdfPage)
);
  const abs = {
    top: nearest.rect.top - pageRect.top,
    left: nearest.rect.left - pageRect.left,
    width: nearest.rect.width,
    height: nearest.rect.height,
  };

  // Save highlight (using pixel coords for UI only)
  setHighlights((prev) => [
    ...prev,
    { page: pageNumber, text, field: activeField, rects: [abs] },
  ]);

  // SAVE NORMALIZED TEMPLATE
  if (activeField) {
    setSceTemplate((prev) => ({
      ...prev,
      [activeField]: {
        page: pageNumber,
        rect: normRects, // <-- normalized rectangle (0–1)
      },
    }));

    // also update extracted text in invoiceData
    setInvoiceData((prev) => ({
      ...prev,
      normalizedData: {
        ...prev.normalizedData,
        header: {
          ...prev.normalizedData.header,
          [activeField]: text,
        },
        items: [...prev.normalizedData.items],
      },
    }));

    setActiveField(null);
  }
};

function getPixelRectsFromClickOrSelection({ range, singleRect, wrapperRect }) {
  // Drag selection
  if (range) {
    return Array.from(range.getClientRects()).map(r => ({
      top: r.top - wrapperRect.top,
      left: r.left - wrapperRect.left,
      width: r.width,
      height: r.height,
    }));
  }

  // Single click
  if (singleRect) {
    return [{
      top: singleRect.top - wrapperRect.top,
      left: singleRect.left - wrapperRect.left,
      width: singleRect.width,
      height: singleRect.height,
    }];
  }

  return [];
}


  useEffect(() => {
  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const wrapper =
      range.startContainer.parentElement.closest(".pdf-page-wrapper");
    if (!wrapper) return;

    const pageNumber = parseInt(wrapper.dataset.pageNumber);
    const wrapperRect = wrapper.getBoundingClientRect();

    const pixelRects = Array.from(range.getClientRects()).map((r) => ({
      top: r.top - wrapperRect.top,
      left: r.left - wrapperRect.left,
      width: r.width,
      height: r.height,
    }));

    const text = sel.toString().trim();

    // Save highlight (pixel coords)
    setHighlights((prev) => [
      ...prev,
      { page: pageNumber, text, field: activeField, rects: pixelRects },
    ]);
    if (activeField) {
  const top = Math.min(...pixelRects.map(r => r.top));
const left = Math.min(...pixelRects.map(r => r.left));
const bottom = Math.max(...pixelRects.map(r => r.top + r.height));
const right = Math.max(...pixelRects.map(r => r.left + r.width));

const boundingAbs = {
  top,
  left,
  width: right - left,
  height: bottom - top,
};
const pageRect = wrapper.getBoundingClientRect();
const pdfPage = pageRefs.current[pageNumber];
const norm = normalizeRect(boundingAbs, pageRect, pdfPage);

      setSceTemplate((prev) => ({
        ...prev,
        [activeField]: {
          page: pageNumber,
          rect: norm, // normalized coords saved
        },
      }));

      setInvoiceData((prev) => ({
        ...prev,
        normalizedData: {
          ...prev.normalizedData,
          header: {
            ...prev.normalizedData.header,
            [activeField]: text,
          },
          items: [...prev.normalizedData.items],
        },
      }));

      setActiveField(null);
    }

    sel.removeAllRanges();
  };

  document.addEventListener("mouseup", handleMouseUp);
  return () => document.removeEventListener("mouseup", handleMouseUp);
}, [activeField]);


  // -------------------------------------------------------------------
  // RENDER HIGHLIGHTS
  // -------------------------------------------------------------------
  const renderHighlightLayer = (page) => {
    const list = highlights.filter((h) => h.page === page);
    return (
      <div className="absolute inset-0 pointer-events-none z-50">
        {list.map((h, hi) =>
          h.rects.map((r, ri) => (
            <div
              key={`${hi}-${ri}`}
              style={{
                position: "absolute",
                top: r.top,
                left: r.left,
                width: r.width,
                height: r.height,
                background: "yellow",
                opacity: 0.35,
                borderRadius: 2,
              }}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="w-full h-[calc(100vh-80px)]">
        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border w-full"
        >
          <ResizablePanel defaultSize={60} minSize={40}>
            <UploadDataView
              headerFields={fieldsInfo?.headerData}
              itemFields={fieldsInfo?.itemData}
              view={selectedView}
              data={invoiceData}
              submit={submit}
              handleUploadPrompt={handleUploadPrompt}
              setActiveField={setActiveField} // pass down for SCE
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={40} minSize={30}>
            {data?.fileName && data?.fileType === '.pdf' ? (
              <Document
                file={`${API_URL}/files/${data.fileName}`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from(new Array(numPages), (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <div
                      key={pageNum}
                      className="relative pdf-page-wrapper"
                      data-page-number={pageNum}
                      style={{ marginBottom: 20 }}
                    >
                      <Page
                        pageNumber={pageNum}
                        renderTextLayer={true}
                        renderAnnotationLayer={false}
                        scale={1.0}
                          onRenderSuccess={(page) => {
    pageRefs.current[pageNum] = page;
  }}
                        onClick={(e) => handlePdfClick(e, pageNum)}
                      />
                      {renderHighlightLayer(pageNum)}
                    </div>
                  );
                })}
              </Document>
            ):(
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <iframe
                key={data?.fileName}
                  src={
                    data?.fileName
                      ? `${API_URL}/files/${data.fileName}`
                      : "about:blank"
                  }
                  title="Uploaded File"
                  className="w-full h-full"
                  style={{ 
          border: '1px solid #ccc',
          backgroundColor: '#fff' 
        }}
                />
              </div>
            )
            }
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default UploadDashboard;
