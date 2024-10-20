using System.Text.Json.Serialization;

namespace ITS_APIs.DTOs
{
  public class UserResponseDto
  {

    public required int Id { get; set; }
    public required string Username { get; set; } = "";
    public required string Email { get; set; } = "";
    public required bool IsAdmin { get; set; }

  }
}
