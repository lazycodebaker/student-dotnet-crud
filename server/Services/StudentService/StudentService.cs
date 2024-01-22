
using Microsoft.EntityFrameworkCore;
using Student.Data;
using Student.Models;

namespace Student.Services.StudentService
{
    public class StudentService : IStudent
    {
        private readonly DataContext _context;

        public StudentService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<StudentModel>> AddStudent(StudentModel student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
            return await _context.Students.ToListAsync();
        }

        public async Task<List<StudentModel>?> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student is null)
                return null;

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return await _context.Students.ToListAsync();
        }

        public async Task<List<StudentModel>> GetAllStudents()
        {
            var students = await _context.Students.ToListAsync();
            return students;
        }

        public async Task<StudentModel?> GetSingleStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student is null)
                return null;

            return student;
        }

        public async Task<List<StudentModel>?> UpdateStudent(int id, StudentModel request)
        {
            var student = await _context.Students.FindAsync(id);

            if (student is null)
                return null;

            // update the field whose values are not null 
            // and ignore the fields whose values are null
            student.Name = request.Name ?? student.Name;
            student.Course = request.Course ?? student.Course;
            student.Branch = request.Branch ?? student.Branch;
            student.RollNo = request.RollNo != 0 ? student.RollNo : student.RollNo;
            student.Year = request.Year != 0 ? request.Year : student.Year;

            await _context.SaveChangesAsync();

            return await _context.Students.ToListAsync();
        }
    }
}
