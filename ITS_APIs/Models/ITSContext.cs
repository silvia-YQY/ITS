using Microsoft.EntityFrameworkCore;

namespace ITS_APIs.Models
{
      public class ITSDbContext : DbContext
      {
            public ITSDbContext(DbContextOptions<ITSDbContext> options)
                : base(options)
            {
            }

            public DbSet<Car> Cars { get; set; }
            public DbSet<User> Users { get; set; }
            public DbSet<Order> Orders { get; set; }
            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                  modelBuilder.Entity<User>()
                      .Property(r => r.Role)
                      .HasConversion<string>();  //  Role translate enum to string

                  modelBuilder.Entity<Order>(entity =>
                  {
                        entity.HasKey(e => e.Id);

                        entity.Property(e => e.StartTime)
                  .IsRequired();
                        entity.Property(e => e.EndTime)
                  .IsRequired();
                        entity.Property(e => e.Fee)
                  .IsRequired()
                  .HasColumnType("decimal(18,2)");
                        entity.Property(e => e.OrderStatus)
                  .IsRequired()
                  .HasConversion<int>();

                        entity.Property(e => e.CarId)
                  .HasColumnName("car_id");


                        // relationship with car
                        entity.HasOne(e => e.Car)
                              .WithMany(e => e.Orders)
                              .HasForeignKey(e => e.CarId)
                              .OnDelete(DeleteBehavior.Cascade);

                        // relationship with user
                        entity.HasOne(e => e.User)
                              .WithMany(e => e.Orders)
                              .HasForeignKey(e => e.UserId)
                              .OnDelete(DeleteBehavior.Cascade);
                  });
            }

      }

}
