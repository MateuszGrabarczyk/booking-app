const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export type Tokens = {
  access: string;
  refresh: string;
};

export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}
export function getRefreshToken(): string | null {
  return localStorage.getItem("refreshToken");
}
export function setTokens({ access, refresh }: Tokens) {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
}
export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export async function registerApi(
  email: string,
  password: string,
  password2: string
) {
  const res = await fetch(`${API_URL}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, password2 }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }
  return;
}

export async function loginApi(
  email: string,
  password: string
): Promise<Tokens> {
  const res = await fetch(`${API_URL}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }
  return res.json() as Promise<Tokens>;
}

export async function refreshApi(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token stored");
  const res = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error("Session expired, please log in again");
  }
  const { access } = (await res.json()) as { access: string };
  localStorage.setItem("accessToken", access);
  return access;
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  let token = getAccessToken();
  const call = () =>
    fetch(input, {
      ...init,
      headers: {
        ...init.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let res = await call();
  if (res.status === 401) {
    try {
      token = await refreshApi();
      res = await call();
    } catch {}
  }
  return res;
}
