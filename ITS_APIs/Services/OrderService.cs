using ITS_APIs.DTOs;
using ITS_APIs.Models;
using ITS_APIs.Services;
using Microsoft.EntityFrameworkCore;

namespace ITS_APIs.Services
{
  public class OrderService : IOrderService
  {
    private readonly ITSDbContext _context;

    public OrderService(ITSDbContext context)
    {
      _context = context;
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

    public async Task<Order> CreateOrderAsync(Order Order)
    {
      _context.Orders.Add(Order);
      await _context.SaveChangesAsync();
      return Order;
    }

    public async Task UpdateOrderAsync(Order Order)
    {
      var orderObj = await OrderExists(Order.Id);
      if (orderObj != null)
      {
        _context.Entry(Order).State = EntityState.Modified;
        await _context.SaveChangesAsync();
      }
      else
      {
        throw new KeyNotFoundException($"Order not found");
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
  }
}
