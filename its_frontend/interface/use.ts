import { Order } from "./order";

export enum RoleType {
  User = 0,
  Admin = 1,
}

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
  isAdmin: RoleType; // Assuming 0 = User, 1 = Admin
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: RoleType;
  email: string;
  orders?: Order[]; // Assuming orders are linked
}

export interface UserDto {
  id: number;
  username: string;
  email?: string;
}

export interface UserDtoPagedResultDto {
  items: UserDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
