
using System.ComponentModel.DataAnnotations;

namespace ITS_APIs.DTOs
{
  public class CarDto
  {
    public int Id { get; set; }
    public string Url { get; set; } = "";
    public int UserId { get; set; }

    [Required(ErrorMessage = "CarPlate is required")]
    public decimal CarPlate { get; set; }

    public List<OrderDto> Rentals { get; set; } = new List<OrderDto>();
  }

}
