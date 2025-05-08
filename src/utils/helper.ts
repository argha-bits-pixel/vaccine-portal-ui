import { ErrorRespObject } from "./types";

export const isResponseSuccess = (response: any): boolean => {
  return (response as ErrorRespObject)?.error === undefined;
};

export const setCookie = (
  cookieKey: string,
  cookieValue: string,
  expirationDays: number
) => {
  let expiryDate = "";

  if (expirationDays) {
    const date = new Date();

    date.setTime(date.getTime() + (expirationDays || 30 * 24 * 60 * 60 * 1000));

    expiryDate = `; expiryDate=" ${date.toUTCString()}`;
  }

  document.cookie = `${cookieKey}=${cookieValue || ""}${expiryDate}; path=/`;
};

export const getCookie = (cookieKey: string) => {
  const cookieName = `${cookieKey}=`;

  const cookieArray = document.cookie.split(";");

  for (let cookie of cookieArray) {
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1, cookie.length);
    }

    if (cookie.indexOf(cookieName) == 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
};

export const deleteCookie = (cookieKey: string) => {
  document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};
