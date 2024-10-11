using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITS_APIs.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using AutoMapper;
using ITS_APIs.DTOs;
using ITS_APIs.Services;
using Microsoft.AspNetCore.Authorization;

namespace ITS_APIs.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UserController : ControllerBase
  {

    private readonly IUserService _context;


    private readonly IMapper _mapper;

    private readonly ILogger<UserController> _logger;

    public UserController(IUserService context, IMapper mapper, ILogger<UserController> logger)
    {
      _context = context;
      _mapper = mapper;
      _logger = logger;
    }

    // GET: api/User
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
      // var usersQuery = _context.Users.ToQueryString();
      // Console.WriteLine(usersQuery);
      // return await _context.Users.ToListAsync();

      var users = await _context.GetAllUsersAsync();
      var userDtos = _mapper.Map<List<UserDto>>(users);

      return Ok(userDtos);
    }


    [HttpGet("allByPage")]
    public async Task<ActionResult<PagedResultDto<UserDto>>> GetUsers([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
      try
      {
        var users = await _context.GetPagedUserAsync(pageNumber, pageSize);
        var UserDtos = _mapper.Map<List<UserDto>>(users.Items);

        var pagedResult = new PagedResultDto<UserDto>
        {
          Items = UserDtos,
          TotalCount = users.TotalCount,
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

    // GET: api/User/5
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
      var user = await _context.GetUserByIdAsync(id);

      if (user == null)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, $"user with Id {id} does not exist");
      }
      var userDto = _mapper.Map<UserDto>(user);

      return Ok(userDto);
    }

    // POST: api/User
    [Authorize(Policy = "AdminPolicy")]
    [HttpPost]
    public async Task<ActionResult<User>> PostUser(User user)
    {
      var createdUser = await _context.CreateUserAsync(user);
      var createdUserDto = _mapper.Map<UserDto>(createdUser);

      return CreatedAtAction(nameof(GetUser), new { id = user.Id }, createdUserDto);
    }

    // PUT: api/User/5
    [Authorize(Policy = "AdminPolicy")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutUser(int id, User user)
    {
      if (id != user.Id)
      {
        return BadRequest("Id mismatch");
      }

      try
      {
        await _context.UpdateUserAsync(user);
        return Ok("Update successful");
      }
      catch (Exception error)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, error);
      }

    }

    // DELETE: api/User/5
    [Authorize(Policy = "AdminPolicy")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
      var User = await _context.GetUserByIdAsync(id);
      if (User == null)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, $"User with Id {id} does not exist");

      }
      try
      {
        await _context.DeleteUserAsync(id);
        return Ok("Delete successful");
      }
      catch (Exception ex)
      {
        // 处理异常并记录日志
        _logger.LogError(ex, "An unexpected error occurred while getting user.");
        return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
      }

    }
  }
}
