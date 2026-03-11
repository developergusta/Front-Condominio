const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  console.log(`[API Request] ${options?.method || 'GET'} ${url}`, options?.body ? 'with body' : '');

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    });
  } catch (error) {
    console.error(`[API Network Error] Failed to fetch ${url}`, error);
    throw error;
  }

  console.log(`[API Response] ${response.status} ${response.statusText} for ${url}`);

  // Handle No Content response
  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  console.log(`[API Response Body]`, text ? text.substring(0, 100) + (text.length > 100 ? '...' : '') : '<empty>');
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    // We try to capture ProblemDetails or validation problem dictionaries
    if (data.detail) throw new Error(data.detail);
    if (data.title) throw new Error(data.title);
    if (data.errors) {
      const messages = Object.values(data.errors).flat().join(', ');
      throw new Error(messages);
    }
    throw new Error(data.message || 'An unexpected error occurred');
  }

  return data as T;
}
