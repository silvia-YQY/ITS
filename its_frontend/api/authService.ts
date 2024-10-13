import axiosInstance from "@/lib/axiosInstance";
import { UserLoginDto, UserRegisterDto, AuthResponse } from "@/interface/use";

export const login = (data: UserLoginDto): Promise<AuthResponse> =>
  axiosInstance.post("/api/Auth/login", data);

export const register = (data: UserRegisterDto): Promise<AuthResponse> =>
  axiosInstance.post("/api/Auth/register", data);
