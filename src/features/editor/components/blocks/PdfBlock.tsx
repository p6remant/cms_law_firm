/*
import { type ChangeEvent, useRef, useState } from 'react';
import { Download, ExternalLink, Eye, EyeOff, FileText, Upload } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import type { PdfBlockProps } from '@/features/editor/types';
import {
  formatFileSize,
  getAcceptAttribute,
  getPdfViewerHeightClass,
  validateMediaFile,
} from '@/features/editor/utils/media-utils';

export function PdfBlock({
  eyebrow,
  title,
  description,
  pdfUrl,
  fileName,
  fileSize,
  pageCount,
  displayMode,
  previewHeight,
  showDownloadButton,
  downloadButtonLabel,
  theme,
  layout,
}: PdfBlockProps) {
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [localPdfOverride, setLocalPdfOverride] = useState<{
    basePropUrl: string;
    objectUrl: string;
    name: string;
    size: string;
  } | null>(null);
  const [isViewerExpanded, setIsViewerExpanded] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isLocalActive = Boolean(localPdfOverride && localPdfOverride.basePropUrl === pdfUrl);
  const activePdfUrl = isLocalActive && localPdfOverride ? localPdfOverride.objectUrl : pdfUrl;
  const activeFileName =
    isLocalActive && localPdfOverride ? localPdfOverride.name : fileName || 'Legal-Document.pdf';
  const activeFileSize = isLocalActive && localPdfOverride ? localPdfOverride.size : fileSize;

  const hasValidPdf = Boolean(activePdfUrl.trim());
  const viewerHeightClass = getPdfViewerHeightClass(previewHeight);
  const showEmbeddedViewer = displayMode === 'viewer' && isViewerExpanded;

  const handleUploadPdf = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateMediaFile(file, 'pdf');
    if (!validation.valid) {
      setUploadError(validation.error ?? 'Invalid PDF file.');
      event.target.value = '';
      return;
    }

    setUploadError(null);
    const objectUrl = URL.createObjectURL(file);
    setLocalPdfOverride({
      basePropUrl: pdfUrl,
      objectUrl,
      name: file.name,
      size: formatFileSize(file.size),
    });
    event.target.value = '';
  };

  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <BlockLayout layout={layout}>
      <div
        className={`rounded-2xl border p-6 transition-colors sm:p-8 ${
          isDark
            ? 'border-neutral-800 bg-neutral-950 text-white'
            : 'border-slate-200 bg-white text-slate-900 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptAttribute('pdf')}
          onChange={handleUploadPdf}
          className="hidden"
        />

        {hasHeader && (
          <div className="mb-6 max-w-2xl space-y-2">
            {eyebrow && (
              <p
                className={`text-xs font-semibold tracking-widest uppercase ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {eyebrow}
              </p>
            )}
            {title && <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>}
            {description && (
              <p
                className={`text-sm leading-relaxed sm:text-base ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <div
          className={`flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:p-5 ${
            isDark ? 'border-neutral-800 bg-neutral-900/70' : 'border-slate-200 bg-slate-50/80'
          }`}
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                isDark
                  ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                  : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}
            >
              <FileText className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold sm:text-base">{activeFileName}</h3>
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                    isDark ? 'bg-neutral-800 text-slate-300' : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  PDF
                </span>
              </div>

              <div
                className={`mt-1 flex flex-wrap items-center gap-3 text-xs ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {activeFileSize && <span>Size: {activeFileSize}</span>}
                {pageCount && <span>• {pageCount}</span>}
                <span>
                  {hasValidPdf ? 'Ready for review & download' : 'No PDF document attached'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                isDark
                  ? 'border-neutral-700 bg-neutral-800 text-slate-200 hover:bg-neutral-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload PDF</span>
            </button>

            {displayMode === 'viewer' && hasValidPdf && (
              <button
                type="button"
                onClick={() => {
                  setIsViewerExpanded((prev) => !prev);
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  isDark
                    ? 'border-neutral-700 bg-neutral-800 text-slate-200 hover:bg-neutral-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isViewerExpanded ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Hide Preview</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Show Preview</span>
                  </>
                )}
              </button>
            )}

            {hasValidPdf && (
              <a
                href={activePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  isDark
                    ? 'border-neutral-700 bg-neutral-800 text-slate-200 hover:bg-neutral-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open</span>
              </a>
            )}

            {showDownloadButton && hasValidPdf && (
              <a
                href={activePdfUrl}
                download={activeFileName}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                  isDark
                    ? 'bg-white text-neutral-950 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                <Download className="h-3.5 w-3.5" />
                <span>{downloadButtonLabel || 'Download PDF'}</span>
              </a>
            )}
          </div>
        </div>

        {uploadError && <p className="mt-3 text-xs font-medium text-rose-500">{uploadError}</p>}

        {displayMode === 'viewer' && (
          <div className="mt-4">
            {hasValidPdf ? (
              showEmbeddedViewer && (
                <div
                  className={`overflow-hidden rounded-xl border ${viewerHeightClass} ${
                    isDark ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200 bg-slate-100'
                  }`}
                >
                  <iframe
                    src={activePdfUrl}
                    title={activeFileName}
                    className="h-full w-full border-0"
                  />
                </div>
              )
            ) : (
              <div
                className={`flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-900/40 text-slate-300'
                    : 'border-slate-300 bg-slate-50 text-slate-600'
                }`}
              >
                <FileText className="h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm font-semibold">No PDF Document Loaded</p>
                <p className="mt-1 max-w-md text-xs leading-relaxed opacity-80">
                  Upload a PDF legal brief, regulatory filing, or client guide using the sidebar or
                  button below to enable live document preview.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold ${
                    isDark ? 'bg-white text-neutral-950' : 'bg-slate-900 text-white'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Select PDF File</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </BlockLayout>
  );
}
*/
export {};
