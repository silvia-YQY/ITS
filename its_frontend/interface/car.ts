import { Order } from "./order";
import { User, UserDto } from "./use";

interface Car {
  id: number;
  url?: string;
  userId: number;
  carPlate: string;
  user?: User;
  orders?: Order[];
}

interface CarDto {
  id: number;
  url?: string;
  userId: number;
  carPlate: string;
  user?: UserDto;
}

interface CarDtoPagedResultDto {
  items: CarDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export type { Car, CarDtoPagedResultDto, CarDto };
