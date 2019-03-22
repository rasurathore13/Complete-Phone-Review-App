using Microsoft.EntityFrameworkCore;

namespace API
{
    public class PhoneContext : DbContext
    {
        public PhoneContext(DbContextOptions<PhoneContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Phones>().ToTable("Phones");
        }

        public DbSet<Phones> GetPhones { get; set; }
    }
}