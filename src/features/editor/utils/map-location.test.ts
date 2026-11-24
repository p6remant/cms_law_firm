import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_MAP_COORDINATES,
  clampZoom,
  parseCoordinates,
  parseGoogleMapsUrl,
  resolveDirectionsUrl,
  resolveMapEmbedUrl,
} from './map-location.ts';

void describe('map-location utils', () => {
  void describe('DEFAULT_MAP_COORDINATES', () => {
    void it('provides valid default coordinates for New York HQ', () => {
      assert.strictEqual(DEFAULT_MAP_COORDINATES.lat, 40.7128);
      assert.strictEqual(DEFAULT_MAP_COORDINATES.lng, -74.006);
    });
  });

  void describe('clampZoom', () => {
    void it('returns default 15 for undefined, null, or invalid input', () => {
      assert.strictEqual(clampZoom(), 15);
      assert.strictEqual(clampZoom(null), 15);
      assert.strictEqual(clampZoom(Number.NaN), 15);
      assert.strictEqual(clampZoom('invalid'), 15);
    });

    void it('clamps zoom within [1, 20]', () => {
      assert.strictEqual(clampZoom(0), 1);
      assert.strictEqual(clampZoom(-5), 1);
      assert.strictEqual(clampZoom(25), 20);
      assert.strictEqual(clampZoom(100), 20);
      assert.strictEqual(clampZoom(12), 12);
      assert.strictEqual(clampZoom('14'), 14);
    });
  });

  void describe('parseCoordinates', () => {
    void it('parses valid numeric and string coordinates', () => {
      const numResult = parseCoordinates(40.7128, -74.006);
      assert.deepStrictEqual(numResult, { lat: 40.7128, lng: -74.006 });

      const strResult = parseCoordinates(' 40.7128 ', ' -74.006 ');
      assert.deepStrictEqual(strResult, { lat: 40.7128, lng: -74.006 });
    });

    void it('accepts exact boundary coordinates', () => {
      assert.deepStrictEqual(parseCoordinates(90, 180), { lat: 90, lng: 180 });
      assert.deepStrictEqual(parseCoordinates(-90, -180), { lat: -90, lng: -180 });
      assert.deepStrictEqual(parseCoordinates(0, 0), { lat: 0, lng: 0 });
    });

    void it('rejects out-of-bound coordinates', () => {
      assert.strictEqual(parseCoordinates(90.001, 0), null);
      assert.strictEqual(parseCoordinates(-90.1, 0), null);
      assert.strictEqual(parseCoordinates(0, 180.001), null);
      assert.strictEqual(parseCoordinates(0, -180.5), null);
      assert.strictEqual(parseCoordinates(91, 181), null);
    });

    void it('returns null on invalid, empty, or non-numeric values', () => {
      assert.strictEqual(parseCoordinates(null, 10), null);
      assert.strictEqual(parseCoordinates(10, undefined), null);
      assert.strictEqual(parseCoordinates('', '20'), null);
      assert.strictEqual(parseCoordinates('abc', 20), null);
      assert.strictEqual(parseCoordinates(Number.NaN, 20), null);
      assert.strictEqual(parseCoordinates({}, []), null);
    });
  });

  void describe('parseGoogleMapsUrl', () => {
    void it('parses standard place URL with @lat,lng,zoom format', () => {
      const url =
        'https://www.google.com/maps/place/Empire+State+Building/@40.7484405,-73.9856644,17z';
      const parsed = parseGoogleMapsUrl(url);

      assert.ok(parsed);
      assert.strictEqual(parsed.isIframeSnippet, false);
      assert.strictEqual(parsed.query, 'Empire State Building');
      assert.ok(parsed.coordinates);
      assert.strictEqual(parsed.coordinates.lat, 40.7484405);
      assert.strictEqual(parsed.coordinates.lng, -73.9856644);
    });

    void it('extracts src from iframe HTML snippet', () => {
      const snippet =
        '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215!2d-73.9856!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjQiTiA3M8KwNTknMDguMiJX!5e0!3m2!1sen!2sus!4v1" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>';
      const parsed = parseGoogleMapsUrl(snippet);

      assert.ok(parsed);
      assert.strictEqual(parsed.isIframeSnippet, true);
      assert.ok(parsed.embedUrl?.includes('google.com/maps/embed'));
      assert.ok(parsed.coordinates);
      assert.strictEqual(parsed.coordinates.lat, 40.7484);
      assert.strictEqual(parsed.coordinates.lng, -73.9856);
    });

    void it('handles direct embed URL', () => {
      const url = 'https://www.google.com/maps/embed?pb=custom-embed-string';
      const parsed = parseGoogleMapsUrl(url);

      assert.ok(parsed);
      assert.strictEqual(parsed.isIframeSnippet, false);
      assert.strictEqual(parsed.embedUrl, url);
    });

    void it('extracts search query from query parameters', () => {
      const url = 'https://maps.google.com/?q=Statue+of+Liberty';
      const parsed = parseGoogleMapsUrl(url);

      assert.ok(parsed);
      assert.strictEqual(parsed.isIframeSnippet, false);
      assert.strictEqual(parsed.query, 'Statue of Liberty');
    });

    void it('extracts coordinates when q parameter has lat,lng coordinates', () => {
      const url = 'https://maps.google.com/?q=40.7128,-74.006';
      const parsed = parseGoogleMapsUrl(url);

      assert.ok(parsed);
      assert.deepStrictEqual(parsed.coordinates, { lat: 40.7128, lng: -74.006 });
    });

    void it('returns null on malformed or blank strings', () => {
      assert.strictEqual(parseGoogleMapsUrl(''), null);
      assert.strictEqual(parseGoogleMapsUrl('   '), null);
      assert.strictEqual(parseGoogleMapsUrl('not-a-url'), null);
      assert.strictEqual(parseGoogleMapsUrl('https://example.com/map'), null);
    });
  });

  void describe('resolveMapEmbedUrl', () => {
    void it('generates embed URL for valid coordinates mode', () => {
      const result = resolveMapEmbedUrl({
        locationMode: 'coordinates',
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 16,
      });

      assert.strictEqual(result.isValid, true);
      assert.strictEqual(
        result.embedUrl,
        'https://maps.google.com/maps?q=40.7128,-74.006&z=16&output=embed'
      );
    });

    void it('returns error when coordinates mode has invalid coordinates', () => {
      const result = resolveMapEmbedUrl({
        locationMode: 'coordinates',
        latitude: 95,
        longitude: -74.006,
      });

      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.embedUrl, null);
      assert.ok(result.errorMessage?.includes('Invalid coordinates'));
    });

    void it('resolves direct embed URL in link mode', () => {
      const result = resolveMapEmbedUrl({
        locationMode: 'link',
        googleMapsUrl: 'https://www.google.com/maps/embed?pb=sample',
      });

      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.embedUrl, 'https://www.google.com/maps/embed?pb=sample');
    });

    void it('resolves place URL to coordinates embed in link mode', () => {
      const result = resolveMapEmbedUrl({
        locationMode: 'link',
        googleMapsUrl:
          'https://www.google.com/maps/place/Empire+State+Building/@40.7484,-73.9856,17z',
        zoom: 14,
      });

      assert.strictEqual(result.isValid, true);
      assert.strictEqual(
        result.embedUrl,
        'https://maps.google.com/maps?q=40.7484,-73.9856&z=14&output=embed'
      );
    });

    void it('resolves place query URL in link mode', () => {
      const result = resolveMapEmbedUrl({
        locationMode: 'link',
        googleMapsUrl: 'https://maps.google.com/?q=Statue+of+Liberty',
        zoom: 12,
      });

      assert.strictEqual(result.isValid, true);
      assert.strictEqual(
        result.embedUrl,
        'https://maps.google.com/maps?q=Statue%20of%20Liberty&z=12&output=embed'
      );
    });

    void it('returns error for empty or invalid link in link mode', () => {
      const emptyResult = resolveMapEmbedUrl({
        locationMode: 'link',
        googleMapsUrl: '',
      });
      assert.strictEqual(emptyResult.isValid, false);
      assert.strictEqual(emptyResult.embedUrl, null);

      const invalidResult = resolveMapEmbedUrl({
        locationMode: 'link',
        googleMapsUrl: 'https://example.com/not-google',
      });
      assert.strictEqual(invalidResult.isValid, false);
      assert.strictEqual(invalidResult.embedUrl, null);
    });

    void it('clamps zoom levels appropriately', () => {
      const lowZoom = resolveMapEmbedUrl({
        locationMode: 'coordinates',
        latitude: 40.7128,
        longitude: -74.006,
        zoom: -5,
      });
      assert.ok(lowZoom.embedUrl?.includes('&z=1&'));

      const highZoom = resolveMapEmbedUrl({
        locationMode: 'coordinates',
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 30,
      });
      assert.ok(highZoom.embedUrl?.includes('&z=20&'));
    });
  });

  void describe('resolveDirectionsUrl', () => {
    void it('generates coordinate-based directions URL', () => {
      const url = resolveDirectionsUrl({
        locationMode: 'coordinates',
        latitude: 40.7128,
        longitude: -74.006,
      });

      assert.strictEqual(url, 'https://www.google.com/maps/dir/?api=1&destination=40.7128,-74.006');
    });

    void it('generates address-based directions URL when coordinates are invalid', () => {
      const url = resolveDirectionsUrl({
        locationMode: 'coordinates',
        latitude: 'invalid',
        longitude: 'invalid',
        address: '123 Main St, New York, NY',
      });

      assert.strictEqual(
        url,
        'https://www.google.com/maps/dir/?api=1&destination=123%20Main%20St%2C%20New%20York%2C%20NY'
      );
    });

    void it('respects fallback precedence (coordinates > address > null)', () => {
      // 1. Both coordinates and address -> coordinates win
      const coordWins = resolveDirectionsUrl({
        locationMode: 'coordinates',
        latitude: 40.7128,
        longitude: -74.006,
        address: '123 Main St, New York, NY',
      });
      assert.strictEqual(
        coordWins,
        'https://www.google.com/maps/dir/?api=1&destination=40.7128,-74.006'
      );

      // 2. Only address available -> address wins
      const addressWins = resolveDirectionsUrl({
        locationMode: 'coordinates',
        address: '123 Main St, New York, NY',
      });
      assert.strictEqual(
        addressWins,
        'https://www.google.com/maps/dir/?api=1&destination=123%20Main%20St%2C%20New%20York%2C%20NY'
      );

      // 3. Neither -> null
      const neither = resolveDirectionsUrl({
        locationMode: 'coordinates',
      });
      assert.strictEqual(neither, null);
    });

    void it('handles link mode with parsed coordinates or address', () => {
      const linkWithCoords = resolveDirectionsUrl({
        locationMode: 'link',
        googleMapsUrl:
          'https://www.google.com/maps/place/Empire+State+Building/@40.7484,-73.9856,17z',
      });
      assert.strictEqual(
        linkWithCoords,
        'https://www.google.com/maps/dir/?api=1&destination=40.7484,-73.9856'
      );

      const linkWithQuery = resolveDirectionsUrl({
        locationMode: 'link',
        googleMapsUrl: 'https://maps.google.com/?q=Statue+of+Liberty',
      });
      assert.strictEqual(
        linkWithQuery,
        'https://www.google.com/maps/dir/?api=1&destination=Statue%20of%20Liberty'
      );
    });
  });
});
