// const API_URL = import.meta.env.VITE_API_URL;
// import {
//   ResizablePanelGroup,
//   ResizablePanel,
//   ResizableHandle,
// } from "@/components/ui/resizable";
// import { Document, Page, pdfjs } from "react-pdf";
// import React, { useState, useEffect } from "react";
// import UploadDataView from "./UploadDataView";
// // 1. Configure the PDF Worker (Required for JS)
// // Using unpkg is the easiest way to get it working without complex webpack config
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
// const UploadDashboard = ({
//   data,
//   selectedView,
//   fieldsInfo,
//   submit,
//   handleUploadPrompt,
// }) => {
//   const [activeField, setActiveField] = useState(null);

//   // State for PDF page count
//   const [numPages, setNumPages] = useState(null);
//   const [clickEntries, setClickEntries] = useState([]);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }
//   const handlePdfClick = (event, pageNumber) => {
//     // 1. Page container
//     const pageDiv = event.target.closest(".react-pdf__Page");
//     if (!pageDiv) return;

//     // 2. Get clicked coordinates
//     const rect = pageDiv.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     // 3. Get all text spans rendered by react-pdf
//     const textItems = pageDiv.querySelectorAll(
//       ".react-pdf__Page__textContent span"
//     );

//     let nearestText = "";
//     let minDistance = Infinity;

//     textItems.forEach((span) => {
//       const spanRect = span.getBoundingClientRect();

//       const spanX = spanRect.left - rect.left + spanRect.width / 2;
//       const spanY = spanRect.top - rect.top + spanRect.height / 2;

//       const dist = Math.sqrt(Math.pow(spanX - x, 2) + Math.pow(spanY - y, 2));

//       if (dist < minDistance) {
//         minDistance = dist;
//         nearestText = span.textContent;
//       }
//     });

//     if (!nearestText) return;

//     // 4. Store in your array
//     setClickEntries((prev) => [
//       ...prev,
//       {
//         text: nearestText.trim(),
//         page: pageNumber,
//         x,
//         y,
//         field: activeField || null,
//         time: Date.now(),
//       },
//     ]);

//     console.log("Captured text:", nearestText);
//   };

//   const handlePdfTextSelection = () => {
//     // 1. Get the highlighted text
//     const selection = window.getSelection();
//     const selectedText = selection.toString().trim();

//     // 2. If text is selected and an input field is active, fill it
//     if (selectedText && activeField) {
//       setFormData((prev) => ({
//         ...prev,
//         [activeField]: selectedText,
//       }));

//       // Optional: Clear selection after filling so it feels "consumed"
//       selection.removeAllRanges();
//     }
//   };
//   return (
//     <div className="min-h-screen min-w-full bg-background w-full">
//       <div className="w-full h-[calc(100vh-80px)]">
//         <ResizablePanelGroup
//           direction="horizontal"
//           className="rounded-lg border w-full"
//         >
//           <ResizablePanel defaultSize={60} minSize={40}>
//             <UploadDataView
//               headerFields={fieldsInfo?.headerData}
//               itemFields={fieldsInfo?.itemData}
//               view={selectedView}
//               data={data}
//               submit={submit}
//               handleUploadPrompt={handleUploadPrompt}
//             />
//           </ResizablePanel>
//           <ResizableHandle withHandle />
//           <ResizablePanel defaultSize={40} minSize={30}>
//             {data && data?.fileName && (
//               // <iframe
//               //   src={`${API_URL}/files/${data?.fileName}`}
//               //   //title={isFileUploaded?.fileName}
//               //   className="w-full h-full"
//               //   style={{ border: "none" }}
//               // />
//               <Document
//                 file={`${API_URL}/files/${data?.fileName}`}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 loading={<div className="p-10">Loading PDF...</div>}
//                 error={
//                   <div className="p-10 text-red-500">Failed to load PDF</div>
//                 }
//               >
//                 {Array.from(new Array(numPages), (_, i) => (
//                   <Page
//                     key={`page_${i + 1}`}
//                     pageNumber={i + 1}
//                     renderTextLayer={true}
//                     renderAnnotationLayer={false}
//                     scale={1.0}
//                     onClick={(e) => handlePdfClick(e, i + 1)}
//                   />
//                 ))}
//               </Document>
//             )}
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
//     </div>
//   );
// };

// export default UploadDashboard;
const API_URL = import.meta.env.VITE_API_URL;

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Document, Page, pdfjs } from "react-pdf";
import React, { useState, useEffect } from "react";
import UploadDataView from "./UploadDataView";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const UploadDashboard = ({
  data,
  selectedView,
  fieldsInfo,
  submit,
  handleUploadPrompt,
}) => {
  const [activeField, setActiveField] = useState(null); // currently selected field
  const [numPages, setNumPages] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    headerData: {},
    itemsData: [],
    rawFile: "",
    fileName: "",
    fileType: "",
    fileSize: "",
  });

  // Load PDF
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // -------------------------------------------------------------------
  // CLICK PDF → nearest text → map to activeField
  // -------------------------------------------------------------------
  const handlePdfClick = (event, pageNumber) => {
    const wrapper = event.target.closest(".pdf-page-wrapper");
    if (!wrapper) return;

    const pageRect = wrapper.getBoundingClientRect();

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
    const highlightRect = {
      top: nearest.rect.top - pageRect.top,
      left: nearest.rect.left - pageRect.left,
      width: nearest.rect.width,
      height: nearest.rect.height,
    };

    // Add highlight
    setHighlights((prev) => [
      ...prev,
      { page: pageNumber, text, field: activeField, rects: [highlightRect] },
    ]);

    // Map to field
    if (activeField) {
      setInvoiceData((prev) => ({
        ...prev,
        headerData: {
          ...prev.headerData,
          [activeField]: text,
        },
      }));
      // Optionally clear after mapping
      setActiveField(null);
    }
  };

  // -------------------------------------------------------------------
  // TEXT SELECTION → map to activeField
  // -------------------------------------------------------------------
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

      const rects = Array.from(range.getClientRects()).map((r) => ({
        top: r.top - wrapperRect.top,
        left: r.left - wrapperRect.left,
        width: r.width,
        height: r.height,
      }));

      const text = sel.toString().trim();

      // Add highlight
      setHighlights((prev) => [
        ...prev,
        { page: pageNumber, text, field: activeField, rects },
      ]);

      // Map to field
      if (activeField) {
        setInvoiceData((prev) => ({
          ...prev,
          headerData: {
            ...prev.headerData,
            [activeField]: text,
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
              data={data}
              submit={submit}
              handleUploadPrompt={handleUploadPrompt}
              setActiveField={setActiveField} // pass down for SCE
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={40} minSize={30}>
            {data?.fileName && (
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
                        onClick={(e) => handlePdfClick(e, pageNum)}
                      />
                      {renderHighlightLayer(pageNum)}
                    </div>
                  );
                })}
              </Document>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default UploadDashboard;
