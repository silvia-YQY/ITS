using Microsoft.AspNetCore.Mvc;
using ITS_APIs.Models;
using ITS_APIs.Services;
using AutoMapper;
using ITS_APIs.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace ITS_APIs.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class OrderController : ControllerBase
  {
    private readonly IOrderService _context;
    private readonly IMapper _mapper;
    private readonly ILogger<OrderController> _logger;
    public OrderController(IOrderService context, IMapper mapper, ILogger<OrderController> logger)
    {
      _context = context;
      _mapper = mapper;
      _logger = logger;
    }

    // GET: api/Order
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
      try
      {
        var orders = await _context.GetAllOrdersAsync();
        var orderDtos = _mapper.Map<List<OrderDto>>(orders);
        return Ok(orderDtos);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "An error occurred while fetching orders.");
        return StatusCode(500, "An error occurred while processing your request.");
      }


    }

    [HttpGet("allByPage")]
    public async Task<ActionResult<PagedResultDto<OrderDto>>> GetOrders([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
      try
      {
        var orders = await _context.GetPagedOrderAsync(pageNumber, pageSize);
        var OrderDtos = _mapper.Map<List<OrderDto>>(orders.Items);

        var pagedResult = new PagedResultDto<OrderDto>
        {
          Items = OrderDtos,
          TotalCount = orders.TotalCount,
          PageNumber = pageNumber,
          PageSize = pageSize
        };

        return Ok(pagedResult);
      }
      catch (Exception ex)
      {
        // 处理异常并记录日志
        _logger.LogError(ex, "An unexpected error occurred while getting all cars.");
        return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
      }
    }

    // GET: api/Order/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
      var order = await _context.GetOrderByIdAsync(id);
      if (order == null)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, $"order with Id {id} does not exist");
      }
      var orderDtos = _mapper.Map<OrderDto>(order);
      return Ok(orderDtos);
    }

    // POST: api/Order
    [Authorize(Policy = "AdminPolicy")]
    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder(Order order)
    {
      try
      {
        var createOrder = await _context.CreateOrderAsync(order);
        var createOrderDtos = _mapper.Map<OrderDto>(createOrder);
        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, createOrder);

      }
      catch (Exception error)
      {

        return StatusCode(StatusCodes.Status500InternalServerError, error);
      }

    }

    // PUT: api/Order/5
    [Authorize(Policy = "AdminPolicy")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutOrder(int id, Order order)
    {
      if (id != order.Id)
      {
        return BadRequest("Id mismatch");
      }

      try
      {
        await _context.UpdateOrderAsync(order);

        return Ok("Update successful");
      }
      catch (Exception error)
      {

        return StatusCode(StatusCodes.Status500InternalServerError, error);
      }


    }

    // DELETE: api/Order/5
    [Authorize(Policy = "AdminPolicy")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
      var Order = await _context.GetOrderByIdAsync(id);
      if (Order == null)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, $"Order with Id {id} does not exist");

      }
      try
      {
        await _context.DeleteOrderAsync(id);
        return Ok("Delete successful");
      }
      catch (Exception ex)
      {
        // 处理异常并记录日志
        _logger.LogError(ex, "An unexpected error occurred while getting Order.");
        return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
      }

    }
  }
}
