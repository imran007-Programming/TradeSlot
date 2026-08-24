import Cookies from 'js-cookie';

export function setCookie(name: string, value: string, days: number = 1) {
  Cookies.set(name, value, {
    expires: days,
    path: '/',
    sameSite: 'lax',
    secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
  });
}

export function getCookie(name: string): string | null {
  return Cookies.get(name) || null;
}

export function deleteCookie(name: string) {
  Cookies.remove(name, { path: '/' });
}
