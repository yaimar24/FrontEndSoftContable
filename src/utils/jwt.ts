import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
  sub: string;
  email: string;
  colegioId: string;
  nombreColegio: string;
  logoUrl?: string;
  role: string;
  rolId: string;
  modulos: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number;
  iss: string;
  aud: string;
}

export const getEmailFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.email;
  } catch (err) {
    console.error('Error decodificando JWT', err);
    return null;
  }
};

export const getNombreColegioFromToken = (token: string | null): string | null => { 
  if (!token) return null;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.nombreColegio;
  } catch (err) {
    console.error('Error decodificando JWT', err);
    return null;
  }
};

export const getLogoUrlFromToken = (token: string | null): string | null => { 
  if (!token) return null;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.logoUrl || null;
  } catch (err) {
    console.error('Error decodificando JWT logo', err);
    return null;
  }
};

export const getColegioIdFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.colegioId;
  } catch {
    return null;
  }
};

export const getRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  } catch {
    return null;
  }
};

export const getModulosFromToken = (token: string | null): number[] => {
  if (!token) return [];
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    if (!decoded.modulos) return [];
    return decoded.modulos.split(',').map(Number).filter((n) => !isNaN(n));
  } catch {
    return [];
  }
};

export const getRolIdFromToken = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.rolId ? Number(decoded.rolId) : null;
  } catch {
    return null;
  }
};