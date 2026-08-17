const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5257";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getCurrentUser() {
  return apiFetch<CurrentUser>("/api/auth/me");
}