'use client';

import { useRef, useState } from 'react';
import { useWizard } from './WizardProvider';
import { cn } from '@/lib/cn';

const MAX_PX = 512; // longest side
const MAX_BYTES = 200_000; // ~200KB after resize

/**
 * Drag-and-drop / picker for the band logo. Resizes client-side to
 * ≤512px longest side and stores a base64 data URL on
 * state.band.logoDataUrl. The dataURL is later uploaded to Supabase
 * Storage in finalize.ts.
 */
export function LogoUpload() {
  const { state, dispatch } = useWizard();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const dataUrl = state.band.logoDataUrl;

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Bitte ein Bild auswählen.');
      return;
    }
    setBusy(true);
    try {
      const resized = await resizeToDataUrl(file, MAX_PX);
      // Sanity: hard cap on bytes (rough — base64 is ~33% larger than binary)
      if (resized.length > MAX_BYTES * 1.4) {
        // Try lower quality
        const smaller = await resizeToDataUrl(file, 320, 0.78);
        dispatch({ type: 'patch-band', patch: { logoDataUrl: smaller } });
      } else {
        dispatch({ type: 'patch-band', patch: { logoDataUrl: resized } });
      }
    } catch (e) {
      console.error(e);
      setError('Bild konnte nicht verarbeitet werden.');
    } finally {
      setBusy(false);
    }
  }

  function clear() {
    dispatch({ type: 'patch-band', patch: { logoDataUrl: undefined } });
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        'flex items-center gap-4 p-4 rounded-[12px] border border-dashed transition-colors',
        dragging
          ? 'border-klano-text bg-klano-surface-2'
          : 'border-klano-border bg-klano-surface',
      )}
    >
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="Band-Logo"
          className="h-16 w-16 rounded-[10px] object-cover bg-klano-surface-2 border border-klano-border"
        />
      ) : (
        <div className="h-16 w-16 rounded-[10px] bg-klano-surface-2 border border-klano-border flex items-center justify-center text-klano-text-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-klano-text">
          {dataUrl ? 'Logo hochgeladen' : 'Logo'}
          {busy && <span className="text-klano-text-3 font-normal"> · verarbeite …</span>}
        </p>
        <p className="font-mono text-[11px] text-klano-text-3 mt-0.5">
          PNG/JPG/SVG · wird automatisch skaliert
        </p>
        {error && <p className="text-[12px] text-klano-danger mt-1">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="h-9 px-4 rounded-full text-[13px] bg-klano-surface text-klano-text border border-klano-border hover:border-klano-border-strong transition-colors"
        >
          {dataUrl ? 'Ersetzen' : 'Auswählen'}
        </button>
        {dataUrl && (
          <button
            type="button"
            onClick={clear}
            className="h-9 px-3 rounded-full text-[13px] text-klano-text-3 hover:text-klano-danger transition-colors"
          >
            Entfernen
          </button>
        )}
      </div>
    </div>
  );
}

async function resizeToDataUrl(file: File, maxPx: number, quality = 0.86): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const ratio = Math.min(1, maxPx / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * ratio);
    const h = Math.round(img.naturalHeight * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas-2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);

    // SVG → keep raster export as PNG. JPG/PNG → JPEG output for smaller payload.
    const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    return canvas.toDataURL(mime, mime === 'image/jpeg' ? quality : undefined);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
