/**
 * @fileoverview
 * Cookie utility helpers.
 */

export function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name) {
  return document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, val] = cookie.split('=');
    if (key === name) return decodeURIComponent(val);
    return acc;
  }, null);
}

export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}
