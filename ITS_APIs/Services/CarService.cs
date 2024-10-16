using ITS_APIs.DTOs;
using ITS_APIs.Models;
using ITS_APIs.Services;
using Microsoft.EntityFrameworkCore;

namespace ITS_APIs.Services
{
  public class CarService : ICarService
  {
    private readonly ITSDbContext _context;
    private readonly IUserService _userService;
    private readonly ILogger<CarService> _logger;

    public CarService(ITSDbContext context, ILogger<CarService> logger, IUserService userService)
    {
      _context = context;
      _logger = logger;
      _userService = userService;
    }

    public async Task<IEnumerable<Car>> GetAllCarsAsync()
    {
      return await _context.Cars
                  .Include(c => c.User)  // Include user details
                  .Include(c => c.Orders)
                  .ToListAsync();
    }

    public async Task<PagedResultDto<Car>> GetPagedCarAsync(int pageNumber, int pageSize)
    {
      var query = _context.Cars
                          .Include(c => c.User)  // Include user details
                          .Include(c => c.Orders)
                          .AsQueryable();

      var totalCount = await query.CountAsync();
      var items = await query.Skip((pageNumber - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync();
      _logger.LogInformation($"Total cars found: {totalCount}, Items: {items.Count}");

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

    public async Task<Car> CreateCarAsync(Car car)
    {
      var User = await _userService.UserExists(car.UserId);
      if (User != null)
      {

        _context.Cars.Add(car);
        await _context.SaveChangesAsync();
      }
      else
      {
        throw new KeyNotFoundException($"User Id {car.UserId} not found.");
      }
      return car;

    }

    public async Task UpdateCarAsync(Car car)
    {
      var existingCar = await GetCarByIdAsync(car.Id);
      var User = await _userService.UserExists(car.UserId);
      if (existingCar == null)
      {
        throw new KeyNotFoundException($"Car with Id {car.Id} does not exist");
      }

      if (User != null)
      {
        _context.Entry(existingCar).CurrentValues.SetValues(car);
        await _context.SaveChangesAsync();
      }
      else
      {
        throw new KeyNotFoundException($"User Id {car.UserId} not found.");
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


    public async Task<bool> CheckCarPlate(Car car)
    {
      {
        return await _context.Cars
            .AnyAsync(c => c.CarPlate == car.CarPlate && c.Id != car.Id);  // Ensure it's not the same car being updated
      }
    }
  }
}
