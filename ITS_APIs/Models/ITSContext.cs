using Microsoft.EntityFrameworkCore;

namespace ITS_APIs.Models
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Car> Cars { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<ParkingLocation> ParkingLocations { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<User>()
          .Property(r => r.Role)
          .HasConversion<string>();  //  Role translate enum to string
    }

  }

}
