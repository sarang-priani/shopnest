export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export async function apiFetch(path, options = {}) {
  const user = JSON.parse(localStorage.getItem('shopnest_user') || 'null');
  const headers = { ...options.headers };

  if (user?.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}
