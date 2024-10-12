using ITS_APIs.Services;
using Microsoft.AspNetCore.Mvc;

namespace ITS_APIs.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
  private readonly IDashboardService _dashboardService;

  public DashboardController(IDashboardService dashboardService)
  {
    _dashboardService = dashboardService;
  }

  [HttpGet("totalCarsParked")]
  public async Task<IActionResult> GetTotalCarsParked()
  {
    var totalCars = await _dashboardService.GetTotalCarsParkedAsync();
    return Ok(totalCars);
  }

  [HttpGet("totalRevenue")]
  public async Task<IActionResult> GetTotalRevenue()
  {
    var totalRevenue = await _dashboardService.GetTotalRevenueAsync();
    return Ok(totalRevenue);
  }

  [HttpGet("totalPendingOrder")]
  public async Task<IActionResult> GetRecentActivitiesOrders()
  {
    var totalRevenue = await _dashboardService.GetRecentActivitiesOrdersAsync();
    return Ok(totalRevenue);
  }

  [HttpGet("revenueByDate")]
  public async Task<IActionResult> GetAvailableSpaces(DateTime startDate, DateTime endDate)
  {
    var availableSpaces = await _dashboardService.GetRevenueByDateAsync(startDate, endDate);
    return Ok(availableSpaces);
  }

  [HttpGet("GetOrderStatistics")]
  public async Task<IActionResult> GetOrderStatistics()
  {
    var availableSpaces = await _dashboardService.GetOrderStatisticsAsync();
    return Ok(availableSpaces);
  }

}
