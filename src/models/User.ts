export interface User {
  id: string;
  nombre: string;
  email: string;
  role: 'admin' | 'user';
}