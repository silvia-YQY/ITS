import Cookies from 'js-cookie';
let getToken = () => {};
if (typeof window === 'undefined') {
  // Server-side: Import `next/headers` for accessing cookies
  const { cookies } = require('next/headers');
  getToken = () => {
    const cookieStore = cookies();
    console.log('server side getToken', cookieStore.get('token')?.value);
    return cookieStore.get('token')?.value;
  };
} else {
  getToken = () => {
    console.log(Cookies, Cookies.get('token'), document.cookie);
    return Cookies.get('token');
  };
}
function getAuth() {
  const token = getToken();
  console.log('token', token);
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

export async function fetchFromAPI<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: HeadersInit;
  } = {} // Default options: method is GET if not provided
): Promise<T> {
  console.log('fetchFromAPI');
  const { method = 'GET', body, headers } = options;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const reqHeaders = {
    'Content-Type': 'application/json',
    ...headers, // You can add additional headers if needed
    ...getAuth(),
  };
  console.log(reqHeaders);
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined, // Include body only for POST, PUT, DELETE
    cache: 'no-store',
  });

  if (!res.ok) {
    const contentType = res.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const errorBody = await res.json();
      throw errorBody;
    } else {
      const errorText = await res.text();
      throw new Error(errorText);
    }
  }

  return await res.json();
}
