// Services/IUserService.cs
using ITS_APIs.DTOs;
using ITS_APIs.Models;

namespace ITS_APIs.Services
{
  public interface IUserService
  {
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<PagedResultDto<User>> GetPagedUserAsync(int pageNumber, int pageSize);
    Task<User> GetUserByIdAsync(int id);
    Task<User> CreateUserAsync(User User);
    Task UpdateUserAsync(User User);
    Task DeleteUserAsync(int id);
    Task<User?> UserExists(int id);
  }
}
