let eventListeners = null;

export function initEventListeners() {
  eventListeners = {
    moveCursor: [],
  }
}

export function getEventListeners() {
  return eventListeners;
}

export function addEventListener(eventName, listener) {
  if (!eventListeners[eventName]) {
    throw new Error(`The event name ${eventName} is invalid`);
  }
  eventListeners[eventName].push(listener);
}

export function removeEventListener(eventName, listener) {
  if (!eventListeners[eventName]) {
    throw new Error(`The event name ${eventName} is invalid`);
  }
  const listenerIndex = eventListeners[eventName].indexOf(listener);
  if (listenerIndex > -1) {
    eventListeners[eventName].splice(listenerIndex, 1);
  }
}

export function triggerEvent(eventName, event) {
  if (!eventListeners[eventName]) {
    throw new Error(`The event name ${eventName} is invalid`);
  }
  if (eventListeners[eventName].length) {
    for(let listener of eventListeners[eventName]) {
      listener(event);
    }
  }
}
