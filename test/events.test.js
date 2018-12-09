import assert from 'assert';
import {
  initEventListeners,
  getEventListeners,
  addEventListener,
  removeEventListener,
} from '../src/events';

describe("Events", () => {
  describe("addEventListener", () => {
    it("Add listener for given event type", () => {
      initEventListeners();
      const eventListeners = getEventListeners();

      assert.equal(eventListeners.moveCursor.length, 0);

      const listener = () => {};
      addEventListener('moveCursor', listener);

      assert.equal(eventListeners.moveCursor.length, 1)
      assert.equal(eventListeners.moveCursor[0], listener);

      const otherListener = () => {};
      addEventListener('moveCursor', otherListener);
      assert.equal(eventListeners.moveCursor.length, 2)
      assert.equal(eventListeners.moveCursor[1], otherListener);
    })
  })

  describe("removeEventListener", () => {
    it("Remove listener from listeners for given event type", () => {
      initEventListeners();
      const eventListeners = getEventListeners();

      const listener = () => {};
      addEventListener('moveCursor', listener);

      const otherListener = () => {};
      addEventListener('moveCursor', otherListener);
      assert.equal(eventListeners.moveCursor.length, 2)

      removeEventListener('moveCursor', otherListener);

      assert.equal(eventListeners.moveCursor.length, 1)
      assert.equal(eventListeners.moveCursor[0], listener);

      removeEventListener('moveCursor', listener);
      assert.equal(eventListeners.moveCursor.length, 0)
    })
  })
})
