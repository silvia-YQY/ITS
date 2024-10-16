import { Order } from "./order";

export enum RoleType {
  user = "user",
  admin = "admin",
}

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
  role: RoleType;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  message: string;
  token: string;
  user: User;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  isAdmin: RoleType;
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
