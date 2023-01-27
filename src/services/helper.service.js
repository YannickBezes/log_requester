export const Helper = {
  /**
   *
   * @param {{on: string, do: function, target: object|null} } event
   */
  createHook(event) {
    const target = event.target ?? document;

    if (typeof event.target === 'undefined') {
      event.target = target;
    }

    return event;
  },
  onBeforeMount(hooks) {
    if (Array.isArray(hooks)) {
      hooks.forEach(hook => {
        hook.target.addEventListener(hook.on, hook.do);
      });
    }
  },
  onBeforeUnMount(hooks) {
    if (Array.isArray(hooks)) {
      hooks.forEach(hook => {
        hook.target.removeEventListener(hook.on);
      });
    }
  },
  createHooks(events) {
    if (Array.isArray(events)) {
      return events.map(e => this.createHook(e));
    } else {
      return this.createHook(events);
    }
  },
  emit(event, data = {}) {
    if (typeof event === 'string') {
      const custom_event = new CustomEvent(event, { detail: data });
      document.dispatchEvent(custom_event);
    } else if (typeof event === 'object') {
      const target = event.target || document;
      const custom_event = new CustomEvent(event.name, { detail: data });
      target.dispatchEvent(custom_event);
    }
  }
};
