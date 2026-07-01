export function debounce(callback, delay = 400) {
  let timeoutId;

  const debounced = (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };

  debounced.cancel = () => {
    window.clearTimeout(timeoutId);
  };

  return debounced;
}
