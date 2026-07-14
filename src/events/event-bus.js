// @ts-check

/**
 * @fileoverview
 * Publish/subscribe event bus for decoupled component communication.
 * Components emit and listen to events without direct references to each other.
 *
 * @example
 * import { eventBus } from './events/event-bus.js';
 * eventBus.on('theme:changed', (theme) => console.log(theme));
 * eventBus.emit('theme:changed', 'theme-dark');
 */

/** @typedef {Function} Listener */

class EventBus {
  /** @type {Map<string, Set<Listener>>} */
  #listeners = new Map();

  /**
   * Subscribe to an event.
   * @param {string} event - Event name (see constants EVENTS).
   * @param {Listener} listener - Callback invoked when event is emitted.
   * @returns {Function} Unsubscribe function.
   */
  on(event, listener) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    /** @type {Set<Listener>} */ (this.#listeners.get(event)).add(listener);
    return () => this.off(event, listener);
  }

  /**
   * Subscribe to an event, but only fire once.
   * @param {string} event
   * @param {Listener} listener
   * @returns {Function} Unsubscribe function.
   */
  once(event, listener) {
    /** @type {(...args: *[]) => void} */
    const wrapper = (...args) => {
      listener(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  /**
   * Unsubscribe a listener from an event.
   * @param {string} event
   * @param {Listener} listener
   * @returns {void}
   */
  off(event, listener) {
    this.#listeners.get(event)?.delete(listener);
  }

  /**
   * Emit an event, invoking all registered listeners.
   * @template T
   * @param {string} event
   * @param {...T} args - Arguments passed to each listener.
   */
  emit(event, ...args) {
    this.#listeners.get(event)?.forEach((listener) => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`[EventBus] Error in listener for "${event}":`, error);
      }
    });
  }

  /**
   * Remove all listeners for a given event, or all events.
   * @param {string} [event] - If omitted, clears all events.
   */
  clear(event) {
    if (event) {
      this.#listeners.delete(event);
    } else {
      this.#listeners.clear();
    }
  }
}

/** Singleton instance shared across the application. */
export const eventBus = new EventBus();
