using ITS_APIs.DTOs;
using ITS_APIs.Models;
using ITS_APIs.Services;
using Microsoft.EntityFrameworkCore;

namespace ITS_APIs.Services
{
  public class CarService : ICarService
  {
    private readonly ITSDbContext _context;

    public CarService(ITSDbContext context)
    {
      _context = context;
    }

    public async Task<IEnumerable<Car>> GetAllCarsAsync()
    {
      return await _context.Cars.ToListAsync();
    }

    public async Task<PagedResultDto<Car>> GetPagedCarAsync(int pageNumber, int pageSize)
    {
      var query = _context.Cars.AsQueryable();

      var totalCount = await query.CountAsync();
      var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

      return new PagedResultDto<Car>
      {
        Items = items,
        TotalCount = totalCount,
        PageNumber = pageNumber,
        PageSize = pageSize
      };
    }
    public async Task<Car> GetCarByIdAsync(int id)
    {
      var car = await _context.Cars.FindAsync(id);
      if (car == null)
      {
        throw new KeyNotFoundException($"Car with ID {id} not found.");
      }
      return car;

    }

    public async Task<Car> CreateCarAsync(Car Car)
    {
      _context.Cars.Add(Car);
      await _context.SaveChangesAsync();
      return Car;
    }

    public async Task UpdateCarAsync(Car Car)
    {
      var carObj = await CarExists(Car.Id);
      if (carObj != null)
      {
        _context.Entry(Car).State = EntityState.Modified;
        await _context.SaveChangesAsync();
      }
      else
      {
        throw new KeyNotFoundException($"Cars not found");
      }

    }

    public async Task DeleteCarAsync(int id)
    {
      var Car = await _context.Cars.FindAsync(id);
      if (Car != null)
      {
        _context.Cars.Remove(Car);
        await _context.SaveChangesAsync();
      }
    }

    public async Task<Car?> CarExists(int id)
    {
      return await _context.Cars.FindAsync(id);
    }
  }
}
