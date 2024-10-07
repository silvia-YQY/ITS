using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ITS_APIs.Models;

public enum RoleType
{
  admin,  // Matches the values in the ENUM in SQL
  user
}


public class User
{
  // Id will be the primary key (mapped automatically by EF Core)
  public int Id { get; set; }

  // Username is required
  [Required(ErrorMessage = "Username is required")]
  public string Username { get; set; } = "";

  // Password is required
  [Required(ErrorMessage = "Password is required")]
  public string Password { get; set; } = "";

  [JsonConverter(typeof(JsonStringEnumConverter))]
  public RoleType Role { get; set; }

  // Email is required and unique
  [Required(ErrorMessage = "Email is required")]
  [EmailAddress(ErrorMessage = "Invalid Email Address")]
  public string Email { get; set; } = "";
}
