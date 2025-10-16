"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Maximize2,
  Minimize2,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).href;

// Debounce utility for handling resize events
const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const Page = ({
  canvas,
  pageNum,
}: {
  canvas: HTMLCanvasElement | null;
  pageNum: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvas && containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(canvas);
    }
  }, [canvas]);

  return (
    <Card className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        {!canvas && (
          <div className="flex items-center justify-center min-h-[400px] bg-muted/30">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <div ref={containerRef} className="w-full" />
        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-muted-foreground border">
          Page {pageNum}
        </div>
      </div>
    </Card>
  );
};

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
  onError?: (error: string) => void;
}

export default function PDFViewer({
  pdfUrl,
  title = "Document",
  onError,
}: PDFViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageCanvases, setPageCanvases] = useState<
    Record<number, HTMLCanvasElement>
  >({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Load PDF document
  useEffect(() => {
    if (pdfUrl) {
      let isMounted = true;
      setIsLoading(true);

      const loadingTask = pdfjsLib.getDocument(pdfUrl);

      loadingTask.promise
        .then((pdfDoc) => {
          if (!isMounted) return;
          setPdf(pdfDoc);
          setNumPages(pdfDoc.numPages);
        })
        .catch((err) => {
          if (!isMounted) return;
          onError?.(err.message);
        })
        .finally(() => {
          if (!isMounted) return;
          setIsLoading(false);
        });

      return () => {
        isMounted = false;
        loadingTask.destroy();
      };
    }
  }, [pdfUrl, onError]);

  // Handle responsive rendering
  useEffect(() => {
    if (!scrollRef.current) return;

    setContainerWidth(scrollRef.current.clientWidth);

    const handleResize = debounce(() => {
      if (scrollRef.current) {
        setContainerWidth(scrollRef.current.clientWidth);
        setPageCanvases({});
      }
    }, 200);

    resizeObserverRef.current = new ResizeObserver(handleResize);
    resizeObserverRef.current.observe(scrollRef.current);

    window.addEventListener("resize", handleResize);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Render page function
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdf || !scrollRef.current || containerWidth === 0) return null;

      try {
        const page = await pdf.getPage(pageNum);
        const viewportWidth = containerWidth;
        const originalViewport = page.getViewport({ scale: 1 });

        const scale = viewportWidth / originalViewport.width;
        const dpr = Math.max(window.devicePixelRatio || 1, 1.5);

        const viewport = page.getViewport({ scale: scale * dpr });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

        const renderContext = {
          canvasContext: ctx!,
          viewport: viewport,
          enableWebGL: true,
          renderInteractiveForms: false,
        };

        await page.render(renderContext).promise;
        return canvas;
      } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error);
        return null;
      }
    },
    [pdf, containerWidth]
  );

  // Render initial pages
  useEffect(() => {
    if (!pdf || containerWidth === 0) return;

    setPageCanvases({});

    const preLoad = Math.min(2, numPages);

    for (let i = 1; i <= preLoad; i++) {
      renderPage(i).then((c) => {
        if (c) setPageCanvases((p) => ({ ...p, [i]: c }));
      });
    }
  }, [pdf, numPages, renderPage, containerWidth]);

  // Lazy load pages with IntersectionObserver
  useEffect(() => {
    if (!pdf || !scrollRef.current || containerWidth === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = +entry.target.getAttribute("data-page-number")!;
            if (!pageCanvases[pageNum]) {
              const priority = entry.intersectionRatio > 0.5 ? 1 : 0;

              setTimeout(
                () => {
                  renderPage(pageNum).then((c) => {
                    if (c) setPageCanvases((p) => ({ ...p, [pageNum]: c }));
                  });
                },
                priority === 1 ? 0 : 100
              );
            }
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: scrollRef.current,
        rootMargin: "300px 0px",
        threshold: [0.1, 0.5, 0.9],
      }
    );

    const els = wrapperRef.current?.querySelectorAll("[data-page-number]");
    els?.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, [pdf, pageCanvases, renderPage, containerWidth]);

  // Generate page elements
  const pages = useMemo(() => {
    return Array.from({ length: numPages }, (_, i) => {
      const n = i + 1;
      return (
        <div
          key={n}
          className="page-placeholder"
          data-page-number={n}
          style={{ minHeight: "min(400px, 50vh)" }}
        >
          <Page canvas={pageCanvases[n]} pageNum={n} />
        </div>
      );
    });
  }, [numPages, pageCanvases]);

  // Prevent context menu
  useEffect(() => {
    const onCM = (e: MouseEvent) => {
      if (wrapperRef.current?.contains(e.target as Node)) e.preventDefault();
    };

    document.addEventListener("contextmenu", onCM, { capture: true });

    return () =>
      document.removeEventListener("contextmenu", onCM, { capture: true });
  }, []);

  // Prevent keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && /[psPS]/.test(e.key)) e.preventDefault();
    };

    const onCopy = (e: ClipboardEvent) => {
      if (wrapperRef.current?.contains(e.target as Node)) e.preventDefault();
    };

    document.addEventListener("keydown", onKeyDown, { capture: true });
    document.addEventListener("copy", onCopy, { capture: true });
    document.addEventListener("cut", onCopy, { capture: true });

    return () => {
      document.removeEventListener("keydown", onKeyDown, { capture: true });
      document.removeEventListener("copy", onCopy, { capture: true });
      document.removeEventListener("cut", onCopy, { capture: true });
    };
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const onFS = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFS);
    return () => document.removeEventListener("fullscreenchange", onFS);
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && wrapperRef.current) {
      wrapperRef.current.requestFullscreen().catch((e) => {
        onError?.(e.message);
      });
    } else document.exitFullscreen();
  };

  const scrollToPage = (pageNum: number) => {
    const pageElement = wrapperRef.current?.querySelector(
      `[data-page-number="${pageNum}"]`
    );
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNum);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "w-full mx-auto overflow-hidden rounded-lg border bg-background shadow-lg",
        isFullscreen ? "max-w-none" : "max-w-5xl"
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b bg-muted/30 px-3 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
          <span className="text-sm sm:text-base font-semibold truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {!isLoading && numPages > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 hidden sm:inline-flex"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-muted-foreground px-2">
                <span>{currentPage}</span>
                <span>/</span>
                <span>{numPages}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  scrollToPage(Math.min(numPages, currentPage + 1))
                }
                disabled={currentPage === numPages}
                className="h-8 w-8 p-0 hidden sm:inline-flex"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0 bg-transparent"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "overflow-y-auto bg-muted/20",
          isFullscreen
            ? "h-[calc(100vh-3.5rem)]"
            : "h-[70vh] sm:h-[75vh] lg:h-[80vh]"
        )}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading document...</p>
            <div className="w-full max-w-2xl space-y-4 mt-8">
              <Skeleton className="h-[400px] w-full" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {pages}
          </div>
        )}
      </div>
    </div>
  );
}
