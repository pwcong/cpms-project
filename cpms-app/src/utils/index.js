export * from './hoc';
export * from './date';
export * from './router';
export * from './position';
export * from './file';

export function buildLazyExector(num = 5, duration = 1000) {
  let count = 0;
  let timer = null;

  return function (fn) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      count = 0;
    }, duration);

    if (count < num) {
      count++;
    } else {
      count = 0;
      fn && fn();
    }
  };
}
