using System.ComponentModel;
using ITS_APIs.DTOs;
using ITS_APIs.Models;
using ITS_APIs.Services;
using Microsoft.EntityFrameworkCore;

namespace ITS_APIs.Services
{
  public class UserService : IUserService
  {
    private readonly ITSDbContext _context;

    public UserService(ITSDbContext context)
    {
      _context = context;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
      return await _context.Users.ToListAsync();
    }

    public async Task<PagedResultDto<User>> GetPagedUserAsync(int pageNumber, int pageSize)
    {
      var query = _context.Users.AsQueryable();

      var totalCount = await query.CountAsync();
      var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

      return new PagedResultDto<User>
      {
        Items = items,
        TotalCount = totalCount,
        PageNumber = pageNumber,
        PageSize = pageSize
      };
    }
    public async Task<User> GetUserByIdAsync(int id)
    {
      var user = await _context.Users.FindAsync(id);
      if (user == null)
      {
        throw new KeyNotFoundException($"User with ID {id} not found.");
      }
      return user;

    }

    public async Task<User> CreateUserAsync(User User)
    {
      _context.Users.Add(User);
      await _context.SaveChangesAsync();
      return User;
    }

    public async Task UpdateUserAsync(User User)
    {
      var UserObj = await UserExists(User.Id);
      if (UserObj != null)
      {
        _context.Entry(User).State = EntityState.Modified;
        await _context.SaveChangesAsync();
      }
      else
      {
        throw new KeyNotFoundException($"User not found.");
      }

    }

    public async Task DeleteUserAsync(int id)
    {
      var User = await UserExists(id);
      if (User != null)
      {
        _context.Users.Remove(User);
        await _context.SaveChangesAsync();
      }
    }

    public async Task<User?> UserExists(int id)
    {
      return await _context.Users.FindAsync(id);
    }
  }
}
