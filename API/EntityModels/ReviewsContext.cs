using Microsoft.EntityFrameworkCore;
using API.EntityModels;

namespace API
{
    public class ReviewsContext : DbContext
    {
        public ReviewsContext(DbContextOptions<ReviewsContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Reviews>().ToTable("Reviews");
        }

        public DbSet<Reviews> reviews { get; set; }
    }
}