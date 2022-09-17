
/**
 * Finds csrf token and returns as string in format csrftoken=TOKEN
 * to be used in header of fetch requests.
 * @returns string
 */
const getCookie = () => {
    if (!document.cookie) {
      return null;
    }
  
    const xsrfCookies = document.cookie.split(';')
      .map(c => c.trim())
      .filter(c => c.startsWith('csrftoken='));
  
    if (xsrfCookies.length === 0) {
      return null;
    }
    return decodeURIComponent(xsrfCookies[0].split('=')[1]);
  }

  export { getCookie }