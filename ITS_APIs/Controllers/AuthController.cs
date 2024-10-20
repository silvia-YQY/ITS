using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Text;
using ITS_APIs.Models;
using ITS_APIs.DTOs;
using AutoMapper;
using ITS_APIs.Enums;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;


namespace ITS_APIs.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AuthController : ControllerBase
  {
    private readonly ITSDbContext _context;
    private readonly IConfiguration _configuration;

    private readonly IMapper _mapper;

    private readonly ILogger<AuthController> _logger; // 添加 ILogger 字段

    public AuthController(ITSDbContext context, IConfiguration configuration, ILogger<AuthController> logger, IMapper mapper)
    {
      _context = context;
      _configuration = configuration;
      _logger = logger;
      _mapper = mapper;

    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
    {
      if (await _context.Users.AnyAsync(u => u.Email == userRegisterDto.Email))
        return BadRequest("Email is already in use.");

      var user = new User
      {
        Username = userRegisterDto.Username,
        Email = userRegisterDto.Email,
        Role = userRegisterDto.IsAdmin,
        Password = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password)
      };

      _context.Users.Add(user);
      await _context.SaveChangesAsync();

      return Ok(new { message = $"{(userRegisterDto.IsAdmin == RoleType.admin ? "Admintration" : "User")} registered successfully" });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
    {
      var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

      if (user == null)
      {
        return Unauthorized("Invalid email or password.");
      }

      if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
      {
        return Unauthorized("Invalid email or password.");
      }

      var tokenString = GenerateJwtToken(user);

      var userResponseDto = _mapper.Map<UserResponseDto>(user);

      return Ok(new { Message = "Login successful", Token = tokenString, user = userResponseDto });
    }

    private string GenerateJwtToken(User user)
    {
      var jwtKey = _configuration["Jwt:Key"];
      var jwtIssuer = _configuration["Jwt:Issuer"];
      var jwtAudience = _configuration["Jwt:Audience"];
      if (string.IsNullOrEmpty(jwtKey) || string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtAudience))
      {
        throw new InvalidOperationException("JWT configuration values cannot be null or empty.");
      }

      var claims = new[]
      {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role == RoleType.admin ? "Admin" : "User")
            };

      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
          issuer: jwtIssuer,
          audience: jwtAudience,
          claims: claims,
          expires: DateTime.UtcNow.AddDays(1),
          signingCredentials: creds);

      foreach (var claim in claims)
      {
        Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
      }


      return new JwtSecurityTokenHandler().WriteToken(token);
    }
  }
}
