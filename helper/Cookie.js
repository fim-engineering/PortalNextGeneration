/*
 * Imports from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie/Simple_document.cookie_framework
 * :: cookies.js ::
 *
 * A complete cookies reader/writer framework with full unicode support.
 *
 * Revision #1 - September 4, 2014
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 * https://developer.mozilla.org/User:fusionchess
 * https://github.com/madmurphy/cookies.js
 *
 * This framework is released under the GNU Public License, version 3 or later.
 * http://www.gnu.org/licenses/gpl-3.0-standalone.html
 *
 * Syntaxes:
 *
 * * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
 * * docCookies.getItem(name)
 * * docCookies.removeItem(name[, path[, domain]])
 * * docCookies.hasItem(name)
 * * docCookies.keys()
 *
 */

import canUseDOM from '@canUseDOM';

const Cookies = {
  getItem(sKey) {
    if (!sKey) {
      return null;
    }

    if (!canUseDOM || !document || !document.cookie) {
      return false;
    }

    const regexKeyPart = encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&');
    const fullRegex = new RegExp(`(?:(?:^|.*;)\\s*${regexKeyPart}\\s*\\=\\s*([^;]*).*$)|^.*$`);

    return decodeURIComponent(document.cookie.replace(fullRegex, '$1')) || null;
  },

  setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }

    if (!canUseDOM || !document || !document.cookie) {
      return false;
    }

    let sExpires = '';

    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : `; max-age=${vEnd}`;
          break;
        case String:
          sExpires = `; expires=${vEnd}`;
          break;
        case Date:
          sExpires = `; expires=${vEnd.toUTCString()}`;
          break;
        default:
          throw new Error('Cookies.setItem case undefined');
      }
    }

    const sDomainPart = sDomain ? `; domain=${sDomain}` : '';
    const sPathPart = sPath ? `; path=${sPath}` : '';
    const bSecurePart = bSecure ? '; secure' : '';

    document.cookie = `${encodeURIComponent(sKey)}=${encodeURIComponent(
      sValue,
    )}${sExpires}${sDomainPart}${sPathPart}${bSecurePart}`;

    return true;
  },

  removeItem(sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) {
      return false;
    }

    if (!canUseDOM || !document || !document.cookie) {
      return false;
    }

    const sPathPart = sPath ? `; path=${sPath}` : '';
    const sDomainPart = sDomain ? `; domain=${sDomain}` : '';
    const expiresPart = '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    document.cookie = encodeURIComponent(sKey) + expiresPart + sDomainPart + sPathPart;

    return true;
  },

  hasItem(sKey) {
    if (!sKey) {
      return false;
    }

    if (!canUseDOM || !document || !document.cookie) {
      return false;
    }

    const regex = new RegExp(`(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&')}\\s*\\=`);

    return regex.test(document.cookie);
  },

  keys() {
    if (!canUseDOM || !document || !document.cookie) {
      return false;
    }

    const replaceRegex = /((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g;
    const splitRegex = /\s*(?:=[^;]*)?;\s*/;
    const aKeys = document.cookie.replace(replaceRegex, '').split(splitRegex);

    for (let nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx += 1) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }

    return aKeys;
  },
};

export const setCookie = (key, value) => {
  const rangeTime = 365 * 24 * 60 * 60 * 1000;
  const date = new Date();
  const domain = canUseDOM ? window.location.hostname : '';

  date.setTime(date.getTime() + rangeTime);
  Cookies.setItem(key, value, date, '/', domain, false);
};

export const removeCookie = key => {
  const domain = canUseDOM ? window.location.hostname : '';

  Cookies.removeItem(key, '/', domain);
};

export const getCookie = key => Cookies.getItem(key);

export const getCookieUniversal = (key, cookies) => {
  if (!key) {
    return null;
  }

  const regexKeyPart = encodeURIComponent(key).replace(/[-.+*]/g, '\\$&');
  const fullRegex = new RegExp(`(?:(?:^|.*;)\\s*${regexKeyPart}\\s*\\=\\s*([^;]*).*$)|^.*$`);

  return decodeURIComponent(cookies.replace(fullRegex, '$1')) || null;
}

export default Cookies;
