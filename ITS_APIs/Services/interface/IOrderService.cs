// Services/IOrderService.cs
using System.Security.Claims;
using ITS_APIs.DTOs;
using ITS_APIs.Models;

namespace ITS_APIs.Services
{
  public interface IOrderService
  {
    Task<IEnumerable<Order>> GetAllOrdersAsync();
    Task<PagedResultDto<Order>> GetPagedOrderAsync(int pageNumber, int pageSize);
    Task<Order> GetOrderByIdAsync(int id);
    Task<Order> CreateOrderAsync(Order Order);
    Task UpdateOrderAsync(Order Order);
    Task DeleteOrderAsync(int id);
    Task<Order?> OrderExists(int id);

    Task<Order?> UpdateOrderStatusAsync(Order order);

    decimal CalculateRentalFee(Order order);

    Task<PagedResultDto<Order>> GetPagedOrdersByUserAsync(string userId, ClaimsPrincipal user, int pageNumber, int pageSize);
  }
}
