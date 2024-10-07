using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ITS_APIs.Models;

public class Car
{
  public int Id { get; set; }

  public string Url { get; set; } = "";

  [Column("user_id")]  // mapped UserId to user_id column

  public int UserId { get; set; }


  [Required(ErrorMessage = "CarPlate is required")]
  [Column("car_plate")]  // mapped CarPlate to car_plate column

  public string CarPlate { get; set; } = "";


  public User? User { get; set; }

}
