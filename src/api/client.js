const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function getToken() {
  return localStorage.getItem("streeteat_token");
}

export function setToken(token) {
  if (token) localStorage.setItem("streeteat_token", token);
  else localStorage.removeItem("streeteat_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // Backend's GlobalExceptionHandler returns { message: "..." } on errors.
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

  listVendors: () => request("/api/vendors"),
  getVendor: (id) => request(`/api/vendors/${id}`),
  getVendorMenu: (id) => request(`/api/vendors/${id}/menu`),

  placeOrder: (payload) => request("/api/orders", { method: "POST", body: payload, auth: true }),
  getOrder: (id) => request(`/api/orders/${id}`, { auth: true }),
};
