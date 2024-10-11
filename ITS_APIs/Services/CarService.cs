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
      var car = await _context.Cars
                .Include(c => c.User)  // Include the related users
                .Include(c => c.Orders)  // Include the related orders
                .FirstOrDefaultAsync(c => c.Id == id);
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

    public async Task UpdateCarAsync(Car updatedCar, Car existingCar)
    {
      _context.Entry(existingCar).CurrentValues.SetValues(updatedCar);
      await _context.SaveChangesAsync();

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


    public async Task<bool> CheckCarPlate(Car car)
    {
      {
        return await _context.Cars
            .AnyAsync(c => c.CarPlate == car.CarPlate && c.Id != car.Id);  // Ensure it's not the same car being updated
      }
    }
  }
}
