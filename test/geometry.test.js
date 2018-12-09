import assert from 'assert';
import { makeBox } from '../src/geometry';

describe("Geometry", () => {
  describe("makeBox: creates layout rectangle", () => {
    it("Should make box according to configuration and viewport size", () => {
      const boxConfig = {
        height: 0.5,
        top: 0.25,
        padding: 5,
        margin: [10, 20, 30, 40],
      }

      const viewportWidth = 1000;
      const viewportHeight = 500;
      const devicePixelRatio = 1.0;

      const box = makeBox(viewportWidth, viewportHeight, boxConfig, devicePixelRatio);

      // box with padding: 4 variables in an array
      assert.equal(box.padding.length, 4);

      // left: margin left + half pixel
      assert.equal(box.padding[0], 40 + 0.5);
      // top: margin top + half pixel + top
      assert.equal(box.padding[1], 10 + 0.5 + viewportHeight * 0.25);
      // width: width minus left and right margins
      assert.equal(box.padding[2], viewportWidth - 20 - 40);
      // height: height minus top and bottom margins
      assert.equal(box.padding[3], viewportHeight * 0.5 - 10 - 30);

      // box content (after subtracting padding): 4 variables in an array
      assert.equal(box.content.length, 4);

      // left: margin left + half pixel + padding
      assert.equal(box.content[0], 40 + 0.5 + 5);
      // top: margin top + half pixel + top + padding
      assert.equal(box.content[1], 10 + 0.5 + viewportHeight * 0.25 + 5);
      // width: width minus left and right margins - both paddings
      assert.equal(box.content[2], viewportWidth - 20 - 40 - 5 - 5);
      // height: height minus top and bottom margins - both padding
      assert.equal(box.content[3], viewportHeight * 0.5 - 10 - 30 - 5 - 5);
    })
  })
})
