
import globalConstants from "../constants";

// keeps gatsby happy with server side rendering not having window.localStorage
const localStorage = typeof window !== "undefined" && window.localStorage;
/**
 *
 * @param key - string
 * @param value - Any Value
 * @param [ttl] {number | undefined}- Number of ms that a item in local storage is 'live' (TTL = Time to Live)
 */
const set = (key, value, ttl) => {
  if (ttl === undefined) {
    ttl = globalConstants.config.localStorage.ttl;
  }

  const obj = {
    value: value,
    expires: ttl ? new Date().getTime() + Math.abs(ttl) : null
  };

  localStorage && localStorage.setItem(key, JSON.stringify(obj));
}

/**
 * Get an item from local storage. Will return null if key doesn't exist, or if the item requested
 * is expired.
 * @param key
 * @returns {null | any}
 */
const get = (key) => {
  if (key === undefined) return null;

  const itemString = (localStorage && localStorage.getItem(key)) || null;

  if (itemString === null) return null;

  const item = JSON.parse(itemString);

  if (item['expires'] && new Date().getTime() > item['expires']) {
    remove(key);
    return null;
  }

  return item.value;
}

/**
 * Remove an item in local storage.
 * @param key
 */
const remove = (key) => {
  if (key === undefined) return;

  localStorage && localStorage.removeItem(key);
}

const localStorageHelper = {
  set,
  get,
  remove
}

export default localStorageHelper;
