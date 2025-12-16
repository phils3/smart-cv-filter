import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

// Worker beállítása
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfViewer({ file, maxPages = 2 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    if (!file) {
      const msg = document.createElement("div");
      msg.style.color = "#CFC6C6";
      msg.textContent = "Nincs megjelenítendő PDF";
       // középre igazítás mindkét irányban
      msg.style.display = "flex";
      msg.style.alignItems = "center";      // vertikális középre
      msg.style.justifyContent = "center";  // horizontális középre
      msg.style.height = "100%";            // szülő magasságát vegye
      container.appendChild(msg);
      return;
    }

    let cancelled = false;

    const renderPdf = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;

        const pagesToRender = Math.min(pdf.numPages, maxPages);

        // determine available height for each page (container height)
        let availableHeight = container.clientHeight;
        if (!availableHeight || availableHeight < 100) {
          // fallback when container not measured yet
          availableHeight = Math.round(window.innerHeight * 0.75);
        }

        // render each page into a wrapper that is exactly the availableHeight
        for (let p = 1; p <= pagesToRender; p++) {
          if (cancelled) break;

          const page = await pdf.getPage(p);

          // compute scale so page height matches availableHeight
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = availableHeight / baseViewport.height;
          const scaledViewport = page.getViewport({ scale });

          // wrapper for snapping and centering
          const pageWrapper = document.createElement('div');
          pageWrapper.style.height = availableHeight + 'px';
          pageWrapper.style.display = 'flex';
          pageWrapper.style.alignItems = 'center';
          pageWrapper.style.justifyContent = 'center';
          pageWrapper.style.scrollSnapAlign = 'start';
          pageWrapper.style.width = '100%';

          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(scaledViewport.width);
          canvas.height = Math.floor(scaledViewport.height);
          // ensure canvas visually fits inside the wrapper while preserving aspect
          canvas.style.maxHeight = '100%';
          canvas.style.maxWidth = '100%';
          canvas.style.display = 'block';
          canvas.style.borderRadius = '8px';

          pageWrapper.appendChild(canvas);
          container.appendChild(pageWrapper);

          const ctx = canvas.getContext('2d');
          await page.render({
            canvasContext: ctx,
            viewport: scaledViewport,
          }).promise;
        }
      } catch (err) {
        console.error('PdfViewer render error:', err);
        if (!cancelled) {
          container.innerHTML = '';
          const errEl = document.createElement('div');
          errEl.style.color = '#ff6b6b';
          errEl.textContent = 'Hiba a PDF megjelenítésekor: ' + (err && err.message ? err.message : String(err));
          container.appendChild(errEl);
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [file, maxPages]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxHeight: "80vh",
        overflowY: "auto",
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
        boxSizing: 'border-box'
      }}
    />
  );
}
