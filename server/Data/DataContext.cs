using Microsoft.EntityFrameworkCore;
using Student.Models;

namespace Student.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlite("Data Source=Data/student.db");
        }

        public DbSet<StudentModel> Students { get; set; }
    }
}
