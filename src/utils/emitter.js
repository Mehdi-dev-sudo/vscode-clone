/**
 * @fileoverview
 * Emitter utility — lightweight pub/sub alternative.
 */

export class Emitter {
  constructor() {
    this._listeners = {};
  }

  on(event, fn) {
    (this._listeners[event] = this._listeners[event] || []).push(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    const listeners = this._listeners[event];
    if (!listeners) return;
    this._listeners[event] = listeners.filter((l) => l !== fn);
  }

  emit(event, ...args) {
    const listeners = this._listeners[event];
    if (!listeners) return;
    listeners.forEach((fn) => fn(...args));
  }

  once(event, fn) {
    const wrapper = (...args) => { fn(...args); this.off(event, wrapper); };
    this.on(event, wrapper);
  }
}
