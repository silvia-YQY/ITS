using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITS_APIs.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using ITS_APIs.Services;
using AutoMapper;
using ITS_APIs.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace ITS_APIs.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CarController : ControllerBase
  {
    private readonly ICarService _carService;
    private readonly IMapper _mapper;
    private readonly ILogger<CarController> _logger;

    public CarController(ICarService carService, IMapper mapper, ILogger<CarController> logger)
    {
      _carService = carService;
      _mapper = mapper;
      _logger = logger;
    }

    // GET: api/Car
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Car>>> GetCars()
    {
      var cars = await _carService.GetAllCarsAsync();
      var carDtos = _mapper.Map<List<Car>>(cars);
      return Ok(carDtos);
    }

    [HttpGet("allByPage")]
    public async Task<ActionResult<PagedResultDto<CarDto>>> GetCars([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
      try
      {
        var cars = await _carService.GetPagedCarAsync(pageNumber, pageSize);
        var CarDtos = _mapper.Map<List<CarDto>>(cars.Items);
        _logger.LogInformation($"Fetching cars with PageNumber: {pageNumber}, PageSize: {pageSize}");

        var pagedResult = new PagedResultDto<CarDto>
        {
          Items = CarDtos,
          TotalCount = cars.TotalCount,
          PageNumber = pageNumber,
          PageSize = pageSize
        };

        return Ok(pagedResult);
      }
      catch (Exception ex)
      {

        _logger.LogError(ex, "An unexpected error occurred while getting all cars.");
        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);

      }
    }

    // GET: api/Car/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Car>> GetCar(int id)
    {
      var car = await _carService.GetCarByIdAsync(id);
      if (car == null)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, $"car with Id {id} does not exist");
      }
      var carDtos = _mapper.Map<CarDto>(car);
      return Ok(carDtos);
    }

    // POST: api/Car
    [Authorize(Policy = "AdminPolicy")]
    [HttpPost]
    public async Task<ActionResult<Car>> PostCar(Car car)
    {


      if (await _carService.CheckCarPlate(car))
        return BadRequest("This car plate is already registered.");

      try
      {
        var createCar = await _carService.CreateCarAsync(car);
        var createCarDtos = _mapper.Map<CarDto>(createCar);
        return CreatedAtAction(nameof(GetCar), new { id = car.Id }, createCar);

      }
      catch (Exception error)
      {

        return StatusCode(StatusCodes.Status500InternalServerError, error.Message);
      }
    }

    // PUT: api/Car/5
    [Authorize(Policy = "AdminPolicy")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCar(int id, Car car)
    {
      if (id != car.Id)
      {
        return BadRequest("Id mismatch");
      }

      try
      {
        await _carService.UpdateCarAsync(car);

        return Ok("Update successful");
      }
      catch (Exception ex)
      {
        _logger.LogInformation(ex, "An error occurred while processing the request.");
        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
      }

    }

    // DELETE: api/Car/5
    [Authorize(Policy = "AdminPolicy")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCar(int id)
    {
      var Car = await _carService.GetCarByIdAsync(id);
      if (Car == null)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, $"Car with Id {id} does not exist");

      }
      try
      {
        await _carService.DeleteCarAsync(id);
        return Ok("Delete successful");
      }
      catch (Exception ex)
      {

        _logger.LogError(ex, "An unexpected error occurred while getting Car.");
        return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
      }
    }
  }
}
