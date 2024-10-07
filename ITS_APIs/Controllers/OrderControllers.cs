using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITS_APIs.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ITS_APIs.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class OrderController : ControllerBase
  {
    private readonly AppDbContext _context;

    public OrderController(AppDbContext context)
    {
      _context = context;
    }

    // GET: api/Order
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
      return await _context.Orders
          .Include(o => o.Car)
          .Include(o => o.User)
          .Include(o => o.ParkingLocation)
          .ToListAsync();
    }

    // GET: api/Order/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
      var order = await _context.Orders
          .Include(o => o.Car)
          .Include(o => o.User)
          .Include(o => o.ParkingLocation)
          .FirstOrDefaultAsync(o => o.Id == id);

      if (order == null)
      {
        return NotFound();
      }

      return order;
    }

    // POST: api/Order
    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder(Order order)
    {
      if (order == null)
      {
        return BadRequest("Order data is missing.");
      }

      _context.Orders.Add(order);
      await _context.SaveChangesAsync();

      return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }

    // PUT: api/Order/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutOrder(int id, Order order)
    {
      if (id != order.Id)
      {
        return BadRequest();
      }

      _context.Entry(order).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!OrderExists(id))
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

    // DELETE: api/Order/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
      var order = await _context.Orders.FindAsync(id);
      if (order == null)
      {
        return NotFound();
      }

      _context.Orders.Remove(order);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool OrderExists(int id)
    {
      return _context.Orders.Any(e => e.Id == id);
    }
  }
}
