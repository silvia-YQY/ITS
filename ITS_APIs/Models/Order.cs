using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using ITS_APIs.Enums;


namespace ITS_APIs.Models
{
  public class Order
  {
    public int Id { get; set; } // Primary key

    // Foreign key to the Car
    [Column("car_id")]
    public int CarId { get; set; }

    // Navigation property for Car
    public Car? Car { get; set; }

    // Foreign key to the User
    [Column("user_id")]
    public int UserId { get; set; }

    // Navigation property for User
    public User? User { get; set; }

    // StartTime is required
    [Required(ErrorMessage = "Start time is required")]
    [Column("start_time")]
    public DateTime StartTime { get; set; }

    // EndTime is required
    [Column("end_time")]
    public DateTime EndTime { get; set; }

    // Fee for the order (required and has precision)
    [Required(ErrorMessage = "Fee is required")]
    [Range(0, 999999.99, ErrorMessage = "Fee must be a positive value")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Fee { get; set; }

    // Status Enum (Confirm, Done, Cancel, Pending)
    [Required(ErrorMessage = "OrderStatus is required")]
    [Column(TypeName = "int")]
    public OrderStatus OrderStatus { get; set; }
  }

}
