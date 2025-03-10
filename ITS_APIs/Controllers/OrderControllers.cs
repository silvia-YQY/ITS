using Microsoft.AspNetCore.Mvc;
using ITS_APIs.Models;
using ITS_APIs.Services;
using AutoMapper;
using ITS_APIs.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ITS_APIs.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class OrderController : ControllerBase
  {
    private readonly IOrderService _orderService;
    private readonly IMapper _mapper;
    private readonly ILogger<OrderController> _logger;
    public OrderController(IOrderService service, IMapper mapper, ILogger<OrderController> logger)
    {
      _orderService = service;
      _mapper = mapper;
      _logger = logger;
    }

    // GET: api/Order
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
      try
      {
        var orders = await _orderService.GetAllOrdersAsync();
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
        var orders = await _orderService.GetPagedOrderAsync(pageNumber, pageSize);
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
      var order = await _orderService.GetOrderByIdAsync(id);
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
        var createdOrder = await _orderService.CreateOrderAsync(order);

        var createOrderDtos = _mapper.Map<OrderDto>(createdOrder);
        return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createOrderDtos);

      }
      catch (Exception ex)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
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
        await _orderService.UpdateOrderAsync(order);
        return Ok("Update successful");
      }
      catch (ArgumentException ex)
      {
        _logger.LogError(ex, "Validation failed: {Message}", ex.Message);
        return NotFound(new { message = ex.Message }); // Return 404 for missing entities
      }
      catch (InvalidOperationException ex)
      {
        _logger.LogError(ex, "Failed to update order: {Message}", ex.Message);
        return StatusCode(500, new { message = "Failed to update order" });
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "An unexpected error occurred: {Message}", ex.Message);
        return StatusCode(500, new { message = ex.Message });
      }


    }

    // DELETE: api/Order/5
    [Authorize(Policy = "AdminPolicy")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
      var Order = await _orderService.GetOrderByIdAsync(id);
      if (Order == null)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, $"Order with Id {id} does not exist");

      }
      try
      {
        await _orderService.DeleteOrderAsync(id);
        return Ok("Delete successful");
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "An unexpected error occurred while getting Order.");
        return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
      }

    }

    [Authorize(Policy = "AdminPolicy")]
    [HttpPut("status/{id}")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateDto statusUpdateDto)
    {
      try
      {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
        {
          return NotFound($"Order with id {id} not found");
        }

        // update status
        order.OrderStatus = statusUpdateDto.OrderStatus;

        // save change
        await _orderService.UpdateOrderStatusAsync(order);

        return Ok("Update successful");
      }
      catch (DbUpdateException ex)
      {

        return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
      }
      catch (Exception ex)
      {

        return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
      }
    }

    [HttpGet("userOrders")]
    public async Task<ActionResult<PagedResultDto<OrderDto>>> GetOrdersByUser([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
      try
      {
        // var userId = int.Parse(User.Identity.Name); // 获取当前用户的 ID
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var orders = await _orderService.GetPagedOrdersByUserAsync(userId, User, pageNumber, pageSize);
        var orderDtos = _mapper.Map<List<OrderDto>>(orders.Items);

        var pagedResult = new PagedResultDto<OrderDto>
        {
          Items = orderDtos,
          TotalCount = orders.TotalCount,
          PageNumber = pageNumber,
          PageSize = pageSize
        };

        return Ok(pagedResult);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "An error occurred while fetching user orders.");
        return StatusCode(500, "An error occurred while processing your request.");
      }
    }

  }
}
