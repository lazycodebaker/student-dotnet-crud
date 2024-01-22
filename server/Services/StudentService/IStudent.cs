

using Student.Models;

namespace Student.Services.StudentService
{
    public interface IStudent
    {
        Task<List<StudentModel>> GetAllStudents();
        Task<StudentModel?> GetSingleStudent(int id);
        Task<List<StudentModel>> AddStudent(StudentModel student);
        Task<List<StudentModel>?> UpdateStudent(int id, StudentModel request);
        Task<List<StudentModel>?> DeleteStudent(int id);
    }
}
