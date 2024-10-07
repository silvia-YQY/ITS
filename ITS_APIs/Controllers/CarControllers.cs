using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITS_APIs.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ITS_APIs.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CarController : ControllerBase
  {
    private readonly AppDbContext _context;

    public CarController(AppDbContext context)
    {
      _context = context;
    }

    // GET: api/Car
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Car>>> GetCars()
    {
      // Include the associated User data
      return await _context.Cars.Include(c => c.User).ToListAsync();
    }

    // GET: api/Car/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Car>> GetCar(int id)
    {
      var car = await _context.Cars.Include(c => c.User).FirstOrDefaultAsync(c => c.Id == id);

      if (car == null)
      {
        return NotFound();
      }

      return car;
    }

    // POST: api/Car
    [HttpPost]
    public async Task<ActionResult<Car>> PostCar(Car car)
    {
      if (car == null)
      {
        return BadRequest("Car data is missing.");
      }

      _context.Cars.Add(car);
      await _context.SaveChangesAsync();

      return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
    }

    // PUT: api/Car/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCar(int id, Car car)
    {
      if (id != car.Id)
      {
        return BadRequest();
      }

      _context.Entry(car).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!CarExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

    // DELETE: api/Car/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCar(int id)
    {
      var car = await _context.Cars.FindAsync(id);
      if (car == null)
      {
        return NotFound();
      }

      _context.Cars.Remove(car);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool CarExists(int id)
    {
      return _context.Cars.Any(e => e.Id == id);
    }
  }
}
