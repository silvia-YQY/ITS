using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ITS_APIs.Models;
using ITS_APIs.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Register Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure the DbContext to use MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ITSDbContext>(options =>
{
  options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
         .LogTo(Console.WriteLine, LogLevel.Information);

});


// Add MVC Controller services
builder.Services.AddControllers()
   .AddJsonOptions(options =>
    {
      // 不使用 ReferenceHandler.Preserve，以避免生成 $id 和 $values 字段
      options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
      options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault;
      // 可选：配置其他序列化选项
      options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.Never; // Ensure default values are included
      options.JsonSerializerOptions.PropertyNamingPolicy = null; // Optional: maintain original casing of property names
      options.JsonSerializerOptions.WriteIndented = true; // Optional: format output JSON
    });


builder.Services.AddAutoMapper(typeof(Program).Assembly);


// Register services
builder.Services.AddScoped<ICarService, CarService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();


// add service to container
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtKey))
{
  throw new ArgumentNullException("Jwt configuration values cannot be null or empty.");
}
// config JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
      options.TokenValidationParameters = new TokenValidationParameters
      {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
      };

      options.Events = new JwtBearerEvents
      {
        OnAuthenticationFailed = context =>
        {
          Console.WriteLine($"Token validation failed: {context.Exception.Message}");
          return Task.CompletedTask;
        }
      };
    });

// Add authorization
builder.Services.AddAuthorization(options =>
{
  options.AddPolicy("AdminPolicy", policy =>
 {
   policy.RequireRole("Admin");
   // Add a logging statement here for debugging
   Console.WriteLine("Admin Policy applied.");
 });
  options.AddPolicy("UserPolicy", policy =>
  {
    policy.RequireRole("User");
    Console.WriteLine("User Policy applied.");
  });
});



var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  // Enable Swagger in development mode
  app.UseSwagger();
  app.UseSwaggerUI(c =>
  {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty; // Set Swagger UI to be the root of your app
  });
}



// Use authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(); // This maps the controller routes

app.Run();
