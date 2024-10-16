import axiosInstance from "@/lib/axiosInstance";
import { Car, CarDto, CarDtoPagedResultDto } from "@/interface/car";

export const fetchCars = (): Promise<Car[]> => axiosInstance.get("/api/Car");

// Fetch cars with pagination
export const getCarsByPage = async (pageNumber: number, pageSize: number) => {
  const response = await axiosInstance.get(`/api/Car/userCars`, {
    params: { pageNumber, pageSize },
  });
  return response.data as CarDtoPagedResultDto;
};

export const fetchCarById = (id: number): Promise<Car> =>
  axiosInstance.get(`/api/Car/${id}`);

// Fetch all cars
export const getCars = async (): Promise<Car[]> => {
  const response = await axiosInstance.get("/api/Car");
  return response.data;
};

// Add a new car
export const addCar = async (data: Partial<CarDto>): Promise<void> => {
  await axiosInstance.post("/api/Car", data);
};

// Update an existing car
export const updateCar = async (
  id: number,
  data: Partial<CarDto>
): Promise<void> => {
  await axiosInstance.put(`/api/Car/${id}`, data);
};

// Delete a car
export const deleteCar = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/Car/${id}`);
};
