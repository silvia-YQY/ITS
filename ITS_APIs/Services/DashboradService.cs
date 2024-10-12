using ITS_APIs.Enums;
using ITS_APIs.Models;
using ITS_APIs.Services;
using Microsoft.EntityFrameworkCore;

public class DashboardService : IDashboardService
{
  private readonly ITSDbContext _context;

  public DashboardService(ITSDbContext context)
  {
    _context = context;
  }

  public async Task<int> GetTotalCarsParkedAsync()
  {
    return await _context.Orders
        .Where(o => o.OrderStatus == OrderStatus.Confirm)
        .CountAsync();
  }

  public async Task<List<Order>> GetRecentActivitiesOrdersAsync()
  {
    var doneOrders = await _context.Orders
                               .Where(order => order.OrderStatus == OrderStatus.Pending)
                               .ToListAsync();
    return doneOrders;

  }

  public async Task<decimal> GetTotalRevenueAsync()
  {
    return await _context.Orders
        .Where(o => o.OrderStatus == OrderStatus.Done)
        .SumAsync(o => o.Fee);
  }

  public async Task<decimal> GetRevenueByDateAsync(DateTime startDate, DateTime endDate)
  {
    var revenue = await _context.Orders
        .Where(order => order.EndTime >= startDate && order.EndTime <= endDate)
        .SumAsync(order => order.Fee);

    return revenue;
  }

  public async Task<OrderStatisticsDto> GetOrderStatisticsAsync()
  {
    var totalOrders = await _context.Orders.CountAsync();
    var completedOrders = await _context.Orders
        .Where(order => order.OrderStatus == OrderStatus.Done)
        .CountAsync();
    var pendingOrders = await _context.Orders
        .Where(order => order.OrderStatus == OrderStatus.Pending)
        .CountAsync();
    var canceledOrders = await _context.Orders
        .Where(order => order.OrderStatus == OrderStatus.Cancel)
        .CountAsync();

    return new OrderStatisticsDto
    {
      TotalOrders = totalOrders,
      CompletedOrders = completedOrders,
      PendingOrders = pendingOrders,
      CanceledOrders = canceledOrders
    };
  }

}
