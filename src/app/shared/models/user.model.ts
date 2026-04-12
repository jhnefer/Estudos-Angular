export type UserRole = 'admin' | 'operador' | 'visualizador';
export type UserStatus = 'ativo' | 'inativo';

export type AppUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
};
