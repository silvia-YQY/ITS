using System.Security.Claims;
using ITS_APIs.DTOs;
using ITS_APIs.Models;
using ITS_APIs.Services;
using Microsoft.EntityFrameworkCore;

namespace ITS_APIs.Services
{
  public class OrderService : IOrderService
  {
    private readonly ITSDbContext _context;
    // private readonly ICarService _carService;
    private readonly IUserService _userService;
    private readonly ILogger<OrderService> _logger;
    public OrderService(ITSDbContext context, ILogger<OrderService> logger,
    IUserService userService)
    {
      _context = context;
      // _carService = carService;
      _userService = userService;
      _logger = logger;

    }

    public async Task<IEnumerable<Order>> GetAllOrdersAsync()
    {
      return await _context
                  .Orders
                  .Include(r => r.Car)
                  .Include(r => r.User)
                  .ToListAsync();
    }

    public async Task<PagedResultDto<Order>> GetPagedOrderAsync(int pageNumber, int pageSize)
    {
      var query = _context.Orders.AsQueryable();

      var totalCount = await query.CountAsync();
      var items = await query.Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .Take(pageSize)
                            .Include(r => r.Car)
                            .Include(r => r.User)
                            .ToListAsync();

      return new PagedResultDto<Order>
      {
        Items = items,
        TotalCount = totalCount,
        PageNumber = pageNumber,
        PageSize = pageSize
      };
    }
    public async Task<Order> GetOrderByIdAsync(int id)
    {
      var order = await _context.Orders
                                .Include(r => r.Car)
                                .Include(r => r.User)
                                .FirstOrDefaultAsync(r => r.Id == id);
      if (order == null)
      {
        throw new KeyNotFoundException($"Order with ID {id} not found.");
      }
      return order;

    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
      var User = await _userService.UserExists(order.UserId);
      // var Car = await _carService.CarExists(order.CarId);

      if (User == null)
        throw new KeyNotFoundException($"User with ID {order.UserId} not found.");

      // if (Car == null)
      //   throw new KeyNotFoundException($"Car with ID {order.CarId} not found.");

      _context.Orders.Add(order);
      await _context.SaveChangesAsync();
      return order;
    }

    public async Task UpdateOrderAsync(Order order)
    {
      var existingOrder = await GetOrderByIdAsync(order.Id);


      if (existingOrder == null)
      {
        throw new KeyNotFoundException($"Order with Id {order.Id} does not exist");
      }

      // var existingCar = await _carService.CarExists(order.CarId);
      var existingUser = await _userService.UserExists(order.UserId);

      // if (existingCar == null)
      // {
      //   throw new KeyNotFoundException($"Car with Id {order.CarId} does not exist");
      // }

      if (existingUser == null)
      {
        throw new KeyNotFoundException($"User with Id {order.UserId} does not exist");
      }


      // prevent the start time from being change
      order.StartTime = existingOrder.StartTime;

      // Calculate new fee if end time is changed
      if (order.EndTime != existingOrder.EndTime)
      {
        var fee = CalculateRentalFee(order);
        order.Fee = fee;
        order.OrderStatus = Enums.OrderStatus.Pending;
      }


      try
      {
        // Map new values to existing order, except StartTime
        _context.Entry(existingOrder).CurrentValues.SetValues(order);
        existingOrder.StartTime = order.StartTime;
        await _context.SaveChangesAsync();
      }
      catch (Exception ex)
      {
        throw new InvalidOperationException("An error occurred while creating the order.", ex);
      }
    }

    public async Task DeleteOrderAsync(int id)
    {
      var Order = await OrderExists(id);
      if (Order != null)
      {
        _context.Orders.Remove(Order);
        await _context.SaveChangesAsync();
      }
    }

    public async Task<Order?> OrderExists(int id)
    {
      return await _context.Orders.FindAsync(id);
    }

    public async Task<Order?> UpdateOrderStatusAsync(Order order)
    {

      await _context.SaveChangesAsync();
      return order;
    }

    public async Task<PagedResultDto<Order>> GetPagedOrdersByUserAsync(string userId, ClaimsPrincipal user, int pageNumber, int pageSize)
    {

      // get user role from  Claims 
      var userRole = user.FindFirst(ClaimTypes.Role)?.Value;

      // create base sql
      var query = _context.Orders
                          .Include(c => c.User)
                          .Include(o => o.Car)
                          .AsQueryable();




      // not admin, filter current user data 
      if (userRole != "Admin")
      {
        int parsedUserId;
        if (int.TryParse(userId, out parsedUserId))
        {
          query = query.Where(c => c.UserId == parsedUserId);
          {
            // 处理无法转换为 int 的情况，比如记录日志或抛出异常
            _logger.LogError("Invalid UserId format");
          }
        }
      }


      var totalCount = await query.CountAsync();
      var items = await query.Skip((pageNumber - 1) * pageSize)
                            .Take(pageSize)
                            .ToListAsync();

      return new PagedResultDto<Order>
      {
        Items = items,
        TotalCount = totalCount,
        PageNumber = pageNumber,
        PageSize = pageSize
      };
    }



    public decimal CalculateRentalFee(Order order)
    {
      // Calculate the total number of hours between the end time and start time
      var totalHours = (order.EndTime - order.StartTime).TotalHours;

      // Multiply the total hours by the rate (e.g., 5 per hour)
      return 50 * (decimal)totalHours;
    }
  }
}
