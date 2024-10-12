namespace ITS_APIs.Models;

public class DashboardDto
{
  public int TotalCarsParked { get; set; }
  public decimal TotalRevenue { get; set; }
  public int AvailableSpaces { get; set; }
  public int ActiveOrders { get; set; }
  public decimal AverageParkingDuration { get; set; }
  public List<RecentActivityDto> RecentActivities { get; set; }
  public List<TopUserDto> TopUsers { get; set; }
}

public class RecentActivityDto
{
  public string CarPlate { get; set; }
  public DateTime StartTime { get; set; }
  public DateTime? EndTime { get; set; }
}

public class TopUserDto
{
  public string UserName { get; set; }
  public int OrdersCount { get; set; }
}
