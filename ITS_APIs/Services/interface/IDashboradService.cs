using ITS_APIs.Models;

namespace ITS_APIs.Services;

public interface IDashboardService
{
  Task<int> GetTotalCarsParkedAsync();
  Task<decimal> GetTotalRevenueAsync();

  Task<List<Order>> GetRecentActivitiesOrdersAsync();

  Task<decimal> GetRevenueByDateAsync(DateTime startDate, DateTime endDate);

  Task<OrderStatisticsDto> GetOrderStatisticsAsync();
}

public class OrderStatisticsDto
{
  public int TotalOrders { get; set; }
  public int CompletedOrders { get; set; }
  public int PendingOrders { get; set; }
  public int CanceledOrders { get; set; }
}