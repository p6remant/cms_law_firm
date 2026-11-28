import { type ChangeEvent, useRef, useState } from 'react';
import { Expand, Image as ImageIcon, Upload, X } from 'lucide-react';
import { BlockLayout } from '@/features/editor/components/BlockLayout';
import type { ImageBlockProps, ImageMediaItem } from '@/features/editor/types';
import {
  getAcceptAttribute,
  getImageAspectRatioClass,
  validateMediaFile,
} from '@/features/editor/utils/media-utils';

export function ImageBlock({
  eyebrow,
  title,
  description,
  items,
  columns,
  aspectRatio,
  objectFit,
  showCaptions,
  enableLightbox,
  theme,
  layout,
}: ImageBlockProps) {
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedItems, setUploadedItems] = useState<ImageMediaItem[]>([]);
  const [lightboxItem, setLightboxItem] = useState<ImageMediaItem | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const combinedItems = [...items, ...uploadedItems];

  const gridColsClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  const aspectClass = getImageAspectRatioClass(aspectRatio);
  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';

  const handleUploadFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const newImages: ImageMediaItem[] = [];
    for (const file of Array.from(fileList)) {
      const validation = validateMediaFile(file, 'image');
      if (!validation.valid) {
        setUploadError(validation.error ?? 'Invalid image format.');
        continue;
      }

      const objectUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
      newImages.push({
        imageUrl: objectUrl,
        alt: cleanName || 'Uploaded Image',
        caption: file.name,
        category: 'Uploaded',
      });
    }

    if (newImages.length > 0) {
      setUploadError(null);
      setUploadedItems((prev) => [...prev, ...newImages]);
    }
    event.target.value = '';
  };

  const hasHeader = Boolean(eyebrow || title || description);

  return (
    <section
      className={`w-full border-b transition-colors ${
        isDark
          ? 'border-neutral-800 bg-neutral-950 text-white'
          : 'border-slate-200 bg-white text-slate-900'
      }`}
    >
      <BlockLayout layout={layout} className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAcceptAttribute('image')}
          onChange={handleUploadFiles}
          className="hidden"
        />

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          {hasHeader ? (
            <div className="max-w-2xl space-y-2">
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
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`inline-flex items-center gap-1.5 self-start border px-3.5 py-2 text-xs font-semibold transition-colors sm:self-auto ${
              isDark
                ? 'border-neutral-800 bg-neutral-900 text-slate-200 hover:bg-neutral-800'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Images</span>
          </button>
        </div>

        {uploadError && <p className="mb-4 text-xs font-medium text-rose-500">{uploadError}</p>}

        {combinedItems.length > 0 ? (
          <div className={`grid gap-6 ${gridColsClass}`}>
            {combinedItems.map((item, idx) => {
              const hasImage = Boolean(item.imageUrl.trim());
              return (
                <figure
                  key={`${item.alt}-${String(idx)}`}
                  className={`group flex flex-col overflow-hidden border transition-all ${
                    isDark
                      ? 'border-neutral-800 bg-neutral-900/60'
                      : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <div className={`relative overflow-hidden ${aspectClass} bg-slate-900/5`}>
                    {hasImage ? (
                      <>
                        <img
                          src={item.imageUrl}
                          alt={item.alt || 'Gallery image'}
                          loading="lazy"
                          className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.02] ${fitClass}`}
                        />
                        {item.category && (
                          <span className="absolute top-3 left-3 border border-white/20 bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white">
                            {item.category}
                          </span>
                        )}
                        {enableLightbox && (
                          <button
                            type="button"
                            onClick={() => {
                              setLightboxItem(item);
                            }}
                            aria-label={`View ${item.alt || 'image'} fullscreen`}
                            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 border border-white/20 bg-black/70 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/85"
                          >
                            <Expand className="h-3.5 w-3.5" />
                            <span>Inspect</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <div
                        className={`flex min-h-52 w-full flex-col items-center justify-center p-6 text-center ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        <ImageIcon className="h-8 w-8 opacity-60" />
                        <p className="mt-2 text-xs font-medium">No image uploaded</p>
                      </div>
                    )}
                  </div>

                  {showCaptions && (item.alt || item.caption) && (
                    <figcaption className="space-y-1 p-4">
                      {item.alt && <p className="text-sm font-semibold">{item.alt}</p>}
                      {item.caption && (
                        <p
                          className={`text-xs leading-relaxed ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {item.caption}
                        </p>
                      )}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center border border-dashed p-12 text-center ${
              isDark
                ? 'border-neutral-800 bg-neutral-900/40 text-slate-300'
                : 'border-slate-300 bg-slate-50 text-slate-600'
            }`}
          >
            <ImageIcon className="h-10 w-10 text-slate-400" />
            <p className="mt-3 text-sm font-semibold">No Images Added</p>
            <p className="mt-1 max-w-sm text-xs opacity-80">
              Upload high-resolution photos, awards, or courtroom exhibits using the sidebar or
              button below.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold ${
                isDark ? 'bg-white text-neutral-950' : 'bg-slate-900 text-white'
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Image Files</span>
            </button>
          </div>
        )}

        {lightboxItem && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => {
              setLightboxItem(null);
            }}
          >
            <div
              className="relative max-h-[90vh] max-w-5xl overflow-hidden border border-white/15 bg-neutral-950 p-2 text-white"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                aria-label="Close preview"
                onClick={() => {
                  setLightboxItem(null);
                }}
                className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center border border-white/20 bg-black/70 text-white hover:bg-black"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.alt}
                className="max-h-[78vh] w-auto object-contain"
              />
              {(lightboxItem.alt || lightboxItem.caption) && (
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold">{lightboxItem.alt}</p>
                  {lightboxItem.caption && (
                    <p className="mt-0.5 text-xs text-slate-300">{lightboxItem.caption}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </BlockLayout>
    </section>
  );
}
