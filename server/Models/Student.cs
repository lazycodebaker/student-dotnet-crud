using System.ComponentModel.DataAnnotations;

namespace Student.Models
{
    public class StudentModel
    {
        [Key]
        public int Id { get; set; }

        public int RollNo { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Course { get; set; } = string.Empty;
        public string Branch { get; set; } = string.Empty;

        public int Year { get; set; }
    }
}
