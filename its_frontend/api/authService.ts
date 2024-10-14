import axiosInstance from "@/lib/axiosInstance";
import {
  UserLoginDto,
  UserRegisterDto,
  AuthResponse,
  UserResponseDto,
} from "@/interface/use";

export const login = async (data: UserLoginDto): Promise<UserResponseDto> => {
  const response = await axiosInstance.post("/api/Auth/login", data);
  return response.data as UserResponseDto;
};

export const register = async (
  data: UserRegisterDto
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/api/Auth/register", data);

  return response.data as UserResponseDto;
};
