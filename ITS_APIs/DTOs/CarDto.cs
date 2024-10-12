
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ITS_APIs.DTOs
{
  public class CarDto
  {
    public int Id { get; set; }
    public string Url { get; set; } = "";
    public required int UserId { get; set; }

    [Required(ErrorMessage = "CarPlate is required")]
    public required string CarPlate { get; set; }

    public UserDto User { get; set; } = new UserDto();
  }

}
