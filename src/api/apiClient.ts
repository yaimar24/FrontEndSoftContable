const BASE_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
  useAuth?: boolean;
}

export const apiClient = async (endpoint: string, options: FetchOptions = {}) => {
  const { useAuth = true, ...customOptions } = options;
  
  const headers: HeadersInit = {
    ...customOptions.headers,
  };

  // 1. Inyectar Token automáticamente
  if (useAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }
  }

  if (!(customOptions.body instanceof FormData)) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...customOptions,
    headers,
  });

  // 3. Manejo de errores global (ej: 401 expidado)
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la petición');
  }

  return response.json();
};