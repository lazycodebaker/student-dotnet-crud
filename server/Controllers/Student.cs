using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Student.Models;
using Student.Services.StudentService;

namespace Student.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudent _student;

        public StudentController(IStudent studentService)
        {
            _student = studentService;
        }

        [HttpGet]
        public async Task<ActionResult<List<StudentModel>>> GetAllStudents()
        {
            return await _student.GetAllStudents();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StudentModel>> GetSingleStudent(int id)
        {
            var result = await _student.GetSingleStudent(id);
            if (result is null)
                return NotFound("Student not found.");

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<List<StudentModel>>> AddStudent(StudentModel student)
        {
            var result = await _student.AddStudent(student);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<List<StudentModel>>> UpdateStudent(int id, StudentModel request)
        {
            var result = await _student.UpdateStudent(id, request);
            
            if (result is null)
                return NotFound("Student not found.");

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<List<StudentModel>>> DeleteStudent(int id)
        {
            var result = await _student.DeleteStudent(id);
            if (result is null)
                return NotFound("Student not found.");

            return Ok(result);
        }
    }
}
