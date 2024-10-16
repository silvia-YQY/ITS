using System.Security.Claims;
using ITS_APIs.DTOs;
using ITS_APIs.Enums;
using ITS_APIs.Models;
using ITS_APIs.Services;
using Microsoft.EntityFrameworkCore;

namespace ITS_APIs.Services
{
  public class CarService : ICarService
  {
    private readonly ITSDbContext _context;
    private readonly IUserService _userService;
    private readonly IOrderService _orderService;
    private readonly ILogger<CarService> _logger;

    public CarService(ITSDbContext context, ILogger<CarService> logger, IUserService userService, IOrderService orderService)
    {
      _context = context;
      _logger = logger;
      _userService = userService;
      _orderService = orderService;
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

    public async Task<Car> UpdateCarAsync(Car car)
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
        return car;

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

    public async Task<Car> loginOrderAsync(Car car)
    {
      // Check if the car already exists in the database
      var existingCar = await _context.Cars
          .Include(c => c.Orders)
          .FirstOrDefaultAsync(c => c.CarPlate == car.CarPlate && c.UserId == car.UserId);

      if (existingCar == null)
      {
        // Car does not exist, create it
        _context.Cars.Add(car);
        await _context.SaveChangesAsync();

        // Create a new order for the car
        var newOrder = new Order
        {
          CarId = car.Id,   // newly created car ID
          UserId = car.UserId,
          StartTime = DateTime.Now,
          EndTime = DateTime.MinValue, // Set as default until car leaves
          Fee = 0, // Fee will be calculated on exit
          OrderStatus = OrderStatus.Pending
        };

        await _orderService.CreateOrderAsync(newOrder); // Assuming CreateOrderAsync saves it

        return car; // Return the newly created car
      }
      else
      {
        // Check if there's any ongoing order for the car
        var existingOrder = existingCar.Orders
            .FirstOrDefault(o => o.OrderStatus == OrderStatus.Confirm || o.OrderStatus == OrderStatus.Pending);

        if (existingOrder != null)
        {
          // There is an ongoing order, close it
          existingOrder.EndTime = DateTime.Now;

          // Calculate the fee (assuming the rate is 5 per hour)
          existingOrder.Fee = _orderService.CalculateRentalFee(existingOrder);

          // Update the order status to Done
          existingOrder.OrderStatus = OrderStatus.Done;

          await _orderService.UpdateOrderAsync(existingOrder); // Save updated order
        }
        else
        {
          // No ongoing order, create a new one
          var newOrder = new Order
          {
            CarId = existingCar.Id,   // Use existing car ID
            UserId = existingCar.UserId,
            StartTime = DateTime.Now,
            EndTime = DateTime.MinValue, // Set as default until car leaves
            Fee = 0, // Fee will be calculated on exit
            OrderStatus = OrderStatus.Pending
          };

          await _orderService.CreateOrderAsync(newOrder); // Create new order
        }

        return existingCar; // Return the existing car
      }
    }

    public async Task<PagedResultDto<Car>> GetPagedCarsByUserAsync(int userId, ClaimsPrincipal user, int pageNumber, int pageSize)
    {
      // get user role from  Claims 
      var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
      // create base sql
      var query = _context.Cars
                          .Include(c => c.User)
                          .AsQueryable();

      _logger.LogInformation("User role is: {UserRole}", userRole);


      // not admin, filter current user data 
      if (userRole != "Admin")
      {
        query = query.Where(c => c.UserId == userId);
      }


      var totalCount = await query.CountAsync();
      var items = await query.Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();

      return new PagedResultDto<Car>
      {
        Items = items,
        TotalCount = totalCount,
        PageNumber = pageNumber,
        PageSize = pageSize
      };
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
