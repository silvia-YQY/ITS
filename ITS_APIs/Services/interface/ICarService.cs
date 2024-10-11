// Services/ICarService.cs
using ITS_APIs.DTOs;
using ITS_APIs.Models;

namespace ITS_APIs.Services
{
  public interface ICarService
  {
    Task<IEnumerable<Car>> GetAllCarsAsync();
    Task<PagedResultDto<Car>> GetPagedCarAsync(int pageNumber, int pageSize);
    Task<Car> GetCarByIdAsync(int id);
    Task<Car> CreateCarAsync(Car Car);
    Task UpdateCarAsync(Car Car);
    Task DeleteCarAsync(int id);
  }
}
