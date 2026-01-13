import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
  sub: string;
  email: string;
  colegioId: string;
  nombreColegio: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number;
  iss: string;
  aud: string;
}

export const getEmailFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.nombreColegio;
  } catch (err) {
    console.error('Error decodificando JWT', err);
    return null;
  }

  
};
export const getColegioIdFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.colegioId;
  } catch (err) {
    return null;
  }
};