import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAP_ASPECT_RATIO_OPTIONS,
  MAP_HEIGHT_OPTIONS,
  MAP_LOCATION_MODE_OPTIONS,
  MAP_THEME_OPTIONS,
  SCROLL_DIRECTION_OPTIONS,
  TEAM_IMAGE_SHAPE_OPTIONS,
  getMapContainerClass,
  getTeamImageShapeClass,
} from '../config/field-options.ts';

void describe('field-options map configurations', () => {
  void describe('MAP_LOCATION_MODE_OPTIONS', () => {
    void it('defines expected location modes', () => {
      assert.strictEqual(MAP_LOCATION_MODE_OPTIONS.length, 2);
      const values = MAP_LOCATION_MODE_OPTIONS.map((opt) => opt.value);
      assert.deepStrictEqual(values, ['coordinates', 'link']);
    });
  });

  void describe('MAP_HEIGHT_OPTIONS', () => {
    void it('defines expected height options', () => {
      assert.strictEqual(MAP_HEIGHT_OPTIONS.length, 4);
      const values = MAP_HEIGHT_OPTIONS.map((opt) => opt.value);
      assert.deepStrictEqual(values, ['sm', 'md', 'lg', 'full']);
    });
  });

  void describe('MAP_ASPECT_RATIO_OPTIONS', () => {
    void it('defines expected aspect ratio options', () => {
      assert.strictEqual(MAP_ASPECT_RATIO_OPTIONS.length, 4);
      const values = MAP_ASPECT_RATIO_OPTIONS.map((opt) => opt.value);
      assert.deepStrictEqual(values, ['auto', '16/9', '4/3', '1/1']);
    });
  });

  void describe('MAP_THEME_OPTIONS', () => {
    void it('defines light and dark theme options', () => {
      assert.strictEqual(MAP_THEME_OPTIONS.length, 2);
      const values = MAP_THEME_OPTIONS.map((opt) => opt.value);
      assert.deepStrictEqual(values, ['light', 'dark']);
    });
  });

  void describe('getMapContainerClass', () => {
    void it('maps explicit aspect ratios to corresponding aspect classes', () => {
      assert.strictEqual(getMapContainerClass('sm', '16/9'), 'aspect-video w-full');
      assert.strictEqual(getMapContainerClass('lg', '4/3'), 'aspect-[4/3] w-full');
      assert.strictEqual(getMapContainerClass('full', '1/1'), 'aspect-square w-full');
    });

    void it('falls back to height classes when aspectRatio is auto', () => {
      assert.strictEqual(getMapContainerClass('sm', 'auto'), 'h-64 w-full');
      assert.strictEqual(getMapContainerClass('md', 'auto'), 'h-96 w-full');
      assert.strictEqual(getMapContainerClass('lg', 'auto'), 'h-[32rem] w-full');
      assert.strictEqual(getMapContainerClass('full', 'auto'), 'h-[40rem] w-full');
    });

    void it('falls back to height classes when aspectRatio is undefined', () => {
      assert.strictEqual(getMapContainerClass('sm'), 'h-64 w-full');
      assert.strictEqual(getMapContainerClass('md'), 'h-96 w-full');
      assert.strictEqual(getMapContainerClass('lg'), 'h-[32rem] w-full');
      assert.strictEqual(getMapContainerClass('full'), 'h-[40rem] w-full');
    });

    void it('falls back to default md height when both height and aspectRatio are omitted', () => {
      assert.strictEqual(getMapContainerClass(), 'h-96 w-full');
    });
  });

  void describe('SCROLL_DIRECTION_OPTIONS and TEAM_IMAGE_SHAPE_OPTIONS', () => {
    void it('defines scroll direction options', () => {
      const values = SCROLL_DIRECTION_OPTIONS.map((opt) => opt.value);
      assert.deepStrictEqual(values, ['right', 'left']);
    });

    void it('defines team image shape options', () => {
      const values = TEAM_IMAGE_SHAPE_OPTIONS.map((opt) => opt.value);
      assert.deepStrictEqual(values, ['rounded', 'square', 'rectangle']);
    });

    void it('maps team image shapes to corresponding Tailwind classes', () => {
      assert.ok(getTeamImageShapeClass('rounded').includes('rounded-full'));
      assert.ok(getTeamImageShapeClass('square').includes('aspect-square'));
      assert.ok(getTeamImageShapeClass('rectangle').includes('aspect-[3/4]'));
    });
  });
});
