using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using ITS_APIs.Enums;

namespace ITS_APIs.Models;



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

  public ICollection<Order> Orders { get; set; } = new List<Order>(); // init property

}
