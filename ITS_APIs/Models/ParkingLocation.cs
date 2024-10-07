using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;


namespace ITS_APIs.Models
{
  [Index(nameof(Address), IsUnique = true)]
  public class ParkingLocation
  {
    public int Id { get; set; } // Primary key

    // Name of the parking location
    [Required(ErrorMessage = "location_name is required")]
    [Column("location_name")]
    public string LocationName { get; set; } = "";

    // Address of the parking location
    [Required(ErrorMessage = "Address is required")]
    public string Address { get; set; } = "";

    // Capacity of the parking location (total number of spaces)
    [Required(ErrorMessage = "Capacity is required")]
    [Range(1, 10000, ErrorMessage = "Capacity must be a positive number")]
    public int Capacity { get; set; }

    // Available spaces in the parking location
    [Required(ErrorMessage = "Available spaces are required")]
    [Range(0, int.MaxValue, ErrorMessage = "Available spaces cannot be negative")]
    [Column("available_spaces")]
    public int AvailableSpaces { get; set; }
  }
}
