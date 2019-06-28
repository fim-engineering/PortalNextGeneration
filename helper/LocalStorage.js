import cookie from 'isomorphic-cookie';

/**
 * Checks if current environment supports localStorage
 */
const isSupported = () => {
  return false

  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
};

/**
 * Safely parse a string value to JSON, will return null if there is an error
 */
const safeParse = value => {
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error('Failed parsing JSON in LocalStorage helper: ', e);

    return null;
  }
};

/**
 * Delete a key value pair from localStorage or cookie
 */
const deleteKey = key => {
  if (isSupported()) {
    localStorage.removeItem(key);
  } else {
    cookie.remove(key);
  }
};

/**
 * Get a JSON parsed value from localStorage or cookie
 */
const get = key => {
  if (isSupported()) {
    if (localStorage.getItem(key)) {
      return safeParse(localStorage.getItem(key));
    }

    return null;
  }

  return safeParse(cookie.load(key));
};

/**
 * Set a key value pair to localStorage or cookie depending on which one is supported.
 * @param {any} value any viable JavaScript as it will be parsed.
 * @param {number} cookieExpiry days of expire date if cookie is used instead of localStorage.
 */
const set = (key, value, cookieExpiry = 7) => {
  const strValue = JSON.stringify(value);

  if (isSupported()) {
    localStorage.setItem(key, strValue);
  } else {
    cookie.save(key, strValue, {
      expires: new Date(new Date().getTime() + cookieExpiry * 24 * 60 * 60 * 1000),
    });
  }
};

export {
  get,
  set,
  deleteKey,
}
