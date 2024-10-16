using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ITS_APIs.Enums;

namespace ITS_APIs.DTOs
{
  public class UserRegisterDto
  {
    public required string Username { get; set; } = "";

    [EmailAddress(ErrorMessage = "Invalid Email Address")]
    public required string Email { get; set; } = "";
    public required string Password { get; set; } = "";

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required RoleType IsAdmin { get; set; }

  }
}
