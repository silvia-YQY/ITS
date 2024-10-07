using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITS_APIs.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ITS_APIs.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ParkingLocationController : ControllerBase
  {
    private readonly AppDbContext _context;

    public ParkingLocationController(AppDbContext context)
    {
      _context = context;
    }

    // GET: api/ParkingLocation
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ParkingLocation>>> GetParkingLocations()
    {
      return await _context.ParkingLocations.ToListAsync();
    }

    // GET: api/ParkingLocation/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ParkingLocation>> GetParkingLocation(int id)
    {
      var parkingLocation = await _context.ParkingLocations.FindAsync(id);

      if (parkingLocation == null)
      {
        return NotFound();
      }

      return parkingLocation;
    }

    // POST: api/ParkingLocation
    [HttpPost]
    public async Task<ActionResult<ParkingLocation>> PostParkingLocation(ParkingLocation parkingLocation)
    {
      _context.ParkingLocations.Add(parkingLocation);
      await _context.SaveChangesAsync();

      return CreatedAtAction(nameof(GetParkingLocation), new { id = parkingLocation.Id }, parkingLocation);
    }

    // PUT: api/ParkingLocation/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutParkingLocation(int id, ParkingLocation parkingLocation)
    {
      if (id != parkingLocation.Id)
      {
        return BadRequest();
      }

      _context.Entry(parkingLocation).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!ParkingLocationExists(id))
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

    // DELETE: api/ParkingLocation/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteParkingLocation(int id)
    {
      var parkingLocation = await _context.ParkingLocations.FindAsync(id);
      if (parkingLocation == null)
      {
        return NotFound();
      }

      _context.ParkingLocations.Remove(parkingLocation);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool ParkingLocationExists(int id)
    {
      return _context.ParkingLocations.Any(e => e.Id == id);
    }
  }
}
