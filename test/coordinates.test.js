import assert from 'assert';
import { fromScreen, toScreen } from '../src/coordinates';

describe("Coordinates", () => {
  describe("toScreen", () => {
    it("Translates value to screen coordinate", () => {
      const screenSize = 1024;
      const value = 10000;
      const min = 5000;
      const max = 25000;

      const screenValue = toScreen(value, screenSize, min, max);

      assert.equal(screenValue, 768);
    })
    it("Rounds results to full pixels", () => {
      const screenSize = 1024;
      const value = 10000;
      const min = 5000;
      const max = 20000;

      // value is ont third the range so should be rounded

      const screenValue = toScreen(value, screenSize, min, max);

      assert.equal(screenValue, 683);
    })
  })
  describe("fromScreen", () => {
    it("Translates screen coordinate to actual value", () => {
      const screenSize = 1024;
      const value = 768;
      const min = 5000;
      const max = 25000;

      const screenValue = fromScreen(value, screenSize, min, max);

      assert.equal(screenValue, 10000);
    })
  })
})
