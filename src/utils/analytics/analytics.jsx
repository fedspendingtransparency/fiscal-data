const Analytics = {
  _prefix: 'Fiscal Data - ',
  _execute(...args) {
    if (this.isDAP) {
      window.gas(...args);
    }
    if (this.isGA) {
      window.ga(...args);
    }
    return null;
  },
  get isDAP() {
    return Boolean(window.gas && typeof window.gas === 'function');
  },
  get isGA() {
    return Boolean(window.ga && typeof window.ga === 'function');
  },
  event(args) {
    if (!args.category || !args.action) {
      return;
    }
    this._execute(
      'send',
      'event',
      `${this._prefix}${args.category}`,
      args.action,
      args.label || undefined,
      args.value || undefined,
      args.nonInteraction || undefined
    );
  },
  hit(args) {
    if (!args || !args.hitType) {
      return;
    }
    this._execute('send', 'hit', args.hitType, args.page || undefined);
  },
};

export default Analytics;
