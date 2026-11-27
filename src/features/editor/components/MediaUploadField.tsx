import { type ChangeEvent, type DragEvent, useId, useRef, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Film,
  Image as ImageIcon,
  Link2,
  Trash2,
  Upload,
} from 'lucide-react';
import type { MediaType } from '@/features/editor/types';
import {
  formatFileSize,
  getAcceptAttribute,
  validateMediaFile,
} from '@/features/editor/utils/media-utils';

export type MediaUploadInputProps = {
  label: string;
  mediaType: MediaType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
};

export function MediaUploadInput({
  label,
  mediaType,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: MediaUploadInputProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedMeta, setUploadedMeta] = useState<{ name: string; size: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const accept = getAcceptAttribute(mediaType);

  const handleFile = (file: File) => {
    const validation = validateMediaFile(file, mediaType);
    if (!validation.valid) {
      setErrorMessage(validation.error ?? 'Invalid file type.');
      return;
    }

    setErrorMessage(null);
    const objectUrl = URL.createObjectURL(file);
    setUploadedMeta({
      name: file.name,
      size: formatFileSize(file.size),
    });
    onChange(objectUrl);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    event.target.value = '';
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!readOnly) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (readOnly) return;
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const renderMediaIcon = () => {
    switch (mediaType) {
      case 'video':
        return <Film className="h-4 w-4 text-slate-600" />;
      case 'image':
        return <ImageIcon className="h-4 w-4 text-slate-600" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const formatHint =
    mediaType === 'video'
      ? 'MP4, WebM, OGG or video URL'
      : mediaType === 'image'
        ? 'JPG, PNG, WebP, SVG or image URL'
        : 'PDF document (.pdf) or URL';

  return (
    <div className="space-y-2 py-1">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700">
          {label}
        </label>
        {value && !readOnly && (
          <button
            type="button"
            onClick={() => {
              setUploadedMeta(null);
              setErrorMessage(null);
              onChange('');
            }}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-rose-600 transition-colors hover:bg-rose-50"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border border-dashed p-3 transition-colors ${
          isDragging
            ? 'border-slate-900 bg-slate-100'
            : 'border-slate-300 bg-slate-50/70 hover:border-slate-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          disabled={readOnly}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white">
              {renderMediaIcon()}
            </div>
            <div className="min-w-0">
              {uploadedMeta && value.startsWith('blob:') ? (
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{uploadedMeta.name}</span>
                  <span className="shrink-0 text-[10px] text-slate-500">({uploadedMeta.size})</span>
                </div>
              ) : (
                <p className="truncate text-xs font-medium text-slate-700">
                  {value ? 'Media source connected' : 'Upload local file or drop here'}
                </p>
              )}
              <p className="truncate text-[11px] text-slate-500">{formatHint}</p>
            </div>
          </div>

          <button
            type="button"
            disabled={readOnly}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Browse</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Link2 className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          id={inputId}
          type="text"
          value={value}
          readOnly={readOnly}
          onChange={(e) => {
            setUploadedMeta(null);
            setErrorMessage(null);
            onChange(e.target.value);
          }}
          placeholder={placeholder ?? `Or paste ${mediaType} URL...`}
          className="w-full rounded-md border border-slate-300 bg-white py-1.5 pr-2.5 pl-8 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-hidden"
        />
      </div>

      {errorMessage && <p className="text-[11px] font-medium text-rose-600">{errorMessage}</p>}
    </div>
  );
}
