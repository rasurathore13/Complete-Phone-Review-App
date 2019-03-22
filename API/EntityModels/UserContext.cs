using Microsoft.EntityFrameworkCore;
using API.EntityModels;

namespace API
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("Users");
        }

        public DbSet<User> Users { get; set; }
    }
}