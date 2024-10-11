using System.ComponentModel.DataAnnotations;
using ITS_APIs.Enums;

namespace ITS_APIs.DTOs
{

  public class OrderDto
  {
    public int Id { get; set; }

    [Required(ErrorMessage = "CarId is required")]
    public required int CarId { get; set; }

    [Required(ErrorMessage = "UserId is required")]
    public required int UserId { get; set; }

    [Required(ErrorMessage = "StartTime is required")]
    public required DateTime StartTime { get; set; }

    [Required(ErrorMessage = "EndTime is required")]
    public required DateTime EndTime { get; set; }

    [Required(ErrorMessage = "Fee is required")]
    [Range(1, 10000, ErrorMessage = "Fee must be positive value")]
    public required decimal Fee { get; set; }
    public OrderStatus OrderStatus { get; set; }

    public string? CarPlate { get; set; }
    public string? UserName { get; set; }
  }

  public class OrderStatusUpdateDto
  {
    [Required(ErrorMessage = "OrderStatus is required")]
    public OrderStatus OrderStatus { get; set; }
  }

}
