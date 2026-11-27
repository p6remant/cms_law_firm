import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatFileSize,
  getAcceptAttribute,
  getImageAspectRatioClass,
  // getPdfViewerHeightClass,
  getVideoAspectRatioClass,
  resolveVideoSource,
  validateMediaFile,
} from '../utils/media-utils.ts';

void describe('media-utils', () => {
  void describe('getAcceptAttribute', () => {
    void it('returns appropriate accept string for video, image, and pdf', () => {
      assert.ok(getAcceptAttribute('video').includes('video/mp4'));
      assert.ok(getAcceptAttribute('image').includes('image/png'));
      assert.strictEqual(getAcceptAttribute('pdf'), 'application/pdf,.pdf');
    });
  });

  void describe('validateMediaFile', () => {
    void it('accepts valid video files by MIME type or extension', () => {
      assert.deepStrictEqual(validateMediaFile({ name: 'clip.mp4', type: 'video/mp4' }, 'video'), {
        valid: true,
      });
      assert.deepStrictEqual(validateMediaFile({ name: 'clip.webm', type: '' }, 'video'), {
        valid: true,
      });
    });

    void it('rejects invalid video files', () => {
      const result = validateMediaFile({ name: 'doc.pdf', type: 'application/pdf' }, 'video');
      assert.strictEqual(result.valid, false);
      assert.ok(result.error?.includes('Unsupported file format'));
    });

    void it('accepts valid image files and rejects non-images', () => {
      assert.strictEqual(
        validateMediaFile({ name: 'photo.webp', type: 'image/webp' }, 'image').valid,
        true
      );
      assert.strictEqual(
        validateMediaFile({ name: 'archive.zip', type: 'application/zip' }, 'image').valid,
        false
      );
    });

    void it('accepts valid pdf files and rejects non-pdfs', () => {
      assert.strictEqual(
        validateMediaFile({ name: 'brief.pdf', type: 'application/pdf' }, 'pdf').valid,
        true
      );
      assert.strictEqual(
        validateMediaFile({ name: 'image.png', type: 'image/png' }, 'pdf').valid,
        false
      );
    });
  });

  void describe('formatFileSize', () => {
    void it('formats bytes, kilobytes, and megabytes cleanly', () => {
      assert.strictEqual(formatFileSize(512), '512 B');
      assert.strictEqual(formatFileSize(2048), '2.0 KB');
      assert.strictEqual(formatFileSize(2 * 1024 * 1024), '2.0 MB');
      assert.strictEqual(formatFileSize(-10), '0 B');
    });
  });

  void describe('resolveVideoSource', () => {
    void it('returns empty state when url is blank', () => {
      const res = resolveVideoSource('   ');
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.kind, 'empty');
    });

    void it('resolves blob and direct mp4 URLs as native video', () => {
      const blobRes = resolveVideoSource('blob:http://localhost:5173/abc-123');
      assert.strictEqual(blobRes.isValid, true);
      assert.strictEqual(blobRes.kind, 'native');

      const mp4Res = resolveVideoSource('https://example.com/media/firm-overview.mp4');
      assert.strictEqual(mp4Res.isValid, true);
      assert.strictEqual(mp4Res.kind, 'native');
    });

    void it('resolves YouTube watch and short URLs to embed URL with JS API enabled', () => {
      const ytWatch = resolveVideoSource('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      assert.strictEqual(ytWatch.isValid, true);
      assert.strictEqual(ytWatch.kind, 'youtube');
      assert.ok(ytWatch.src.includes('https://www.youtube.com/embed/dQw4w9WgXcQ'));
      assert.ok(ytWatch.src.includes('enablejsapi=1'));

      const ytShort = resolveVideoSource('https://youtu.be/dQw4w9WgXcQ');
      assert.strictEqual(ytShort.isValid, true);
      assert.strictEqual(ytShort.kind, 'youtube');
    });

    void it('resolves Vimeo URLs to player embed URL', () => {
      const vimeo = resolveVideoSource('https://vimeo.com/76979871');
      assert.strictEqual(vimeo.isValid, true);
      assert.strictEqual(vimeo.kind, 'vimeo');
      assert.ok(vimeo.src.includes('https://player.vimeo.com/video/76979871'));
    });
  });

  void describe('container and aspect ratio class helpers', () => {
    void it('maps video aspect ratios', () => {
      assert.strictEqual(getVideoAspectRatioClass('16/9'), 'aspect-video w-full');
      assert.strictEqual(getVideoAspectRatioClass('21/9'), 'aspect-[21/9] w-full');
      assert.strictEqual(getVideoAspectRatioClass('4/3'), 'aspect-[4/3] w-full');
      assert.strictEqual(getVideoAspectRatioClass('1/1'), 'aspect-square w-full');
    });

    void it('maps image aspect ratios', () => {
      assert.strictEqual(getImageAspectRatioClass('16/9'), 'aspect-video w-full');
      assert.strictEqual(getImageAspectRatioClass('3/4'), 'aspect-[3/4] w-full');
      assert.strictEqual(getImageAspectRatioClass('auto'), 'w-full');
    });

    /*
    void it('maps PDF viewer heights', () => {
      assert.strictEqual(getPdfViewerHeightClass('sm'), 'h-96 w-full');
      assert.strictEqual(getPdfViewerHeightClass('md'), 'h-[32rem] w-full');
      assert.strictEqual(getPdfViewerHeightClass('lg'), 'h-[42rem] w-full');
    });
    */
  });
});
