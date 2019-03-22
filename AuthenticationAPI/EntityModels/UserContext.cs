using Microsoft.EntityFrameworkCore;

namespace AuthenticationAPI.EntityModels
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>().ToTable("UserCredentials");
        }

        public DbSet<Users> GetUser { get; set; }
    }
}