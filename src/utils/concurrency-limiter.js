/**
 * Simple concurrency limiter to prevent connection reset errors
 * when making multiple simultaneous API requests
 */

export const pLimit = (concurrency) => {
  let active = [];
  let waiting = [];

  const run = fn => {
    const p = new Promise((resolve, reject) => {
      if (active.length >= concurrency) {
        waiting.push({ fn, resolve, reject });
        return;
      }

      active.push(p);

      const cleanup = () => {
        active = active.filter(x => x !== p);
        const next = waiting.shift();
        if (next) run(next.fn, next.resolve, next.reject);
      };

      fn().then(resolve).catch(reject).finally(cleanup);
    };
  };

  return run;
};

export const limitConcurrent = pLimit(5); // Limit to 5 concurrent API requests
