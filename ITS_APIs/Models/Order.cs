using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ITS_APIs.Models
{
  public class Order
  {
    public int Id { get; set; } // Primary key

    // Foreign key to the Car
    [Column("car_id")]
    public int CarId { get; set; }

    // Navigation property for Car
    public Car Car { get; set; }

    // Foreign key to the User
    [Column("user_id")]

    public int UserId { get; set; }

    // Navigation property for User
    public User User { get; set; }

    // StartTime is required
    [Required(ErrorMessage = "Start time is required")]
    [Column("start_time")]
    public DateTime StartTime { get; set; }

    // EndTime is required
    [Required(ErrorMessage = "End time is required")]
    [Column("end_time")]
    public DateTime EndTime { get; set; }

    // Parking location foreign key
    [Column("parking_location_id")]
    public int ParkingLocationId { get; set; }

    // Navigation property for ParkingLocation
    public ParkingLocation? ParkingLocation { get; set; }

    // Fee for the order (required and has precision)
    [Required(ErrorMessage = "Fee is required")]
    [Range(0, 999999.99, ErrorMessage = "Fee must be a positive value")]
    public decimal Fee { get; set; }

    // Status Enum (Confirm, Done, Cancel, Pending)
    [Required(ErrorMessage = "Status is required")]
    public OrderStatus Status { get; set; }
  }

  // Enum for Status
  public enum OrderStatus
  {
    Confirm,
    Done,
    Cancel,
    Pending
  }
}
