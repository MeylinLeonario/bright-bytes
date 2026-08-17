using backend.api.src.application.DTOs;
using backend.api.src.models;
using BrightBytes.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.api.src.api.controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/admin/courses
        [HttpGet("courses")]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Courses
                .OrderBy(course => course.Level)
                .Select(course => new
                {
                    course.Id,
                    course.Title,
                    course.Description,
                    course.Level,
                    course.IsPublished,
                    LessonCount = course.Lessons.Count
                })
                .ToListAsync();

            return Ok(courses);
        }

        // GET: /api/admin/courses/{courseId}
        [HttpGet("courses/{courseId:guid}")]
        public async Task<IActionResult> GetCourse(Guid courseId)
        {
            var course = await _context.Courses
                .Where(course => course.Id == courseId)
                .Select(course => new
                {
                    course.Id,
                    course.Title,
                    course.Description,
                    course.Level,
                    course.IsPublished,
                    Lessons = course.Lessons
                        .OrderBy(lesson => lesson.Order)
                        .Select(lesson => new
                        {
                            lesson.Id,
                            lesson.Title,
                            lesson.GrammarPoint,
                            lesson.GrammarExplanation,
                            lesson.Order,
                            lesson.IsPublished
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (course is null)
            {
                return NotFound(new
                {
                    message = "Course not found."
                });
            }

            return Ok(course);
        }

        // GET: /api/admin/courses/{courseId}/lessons
        [HttpGet("courses/{courseId:guid}/lessons")]
        public async Task<IActionResult> GetLessons(Guid courseId)
        {
            var courseExists = await _context.Courses
                .AnyAsync(course => course.Id == courseId);

            if (!courseExists)
            {
                return NotFound(new
                {
                    message = "Course not found."
                });
            }

            var lessons = await _context.Lessons
                .Where(lesson => lesson.CourseId == courseId)
                .OrderBy(lesson => lesson.Order)
                .Select(lesson => new
                {
                    lesson.Id,
                    lesson.CourseId,
                    lesson.Title,
                    lesson.GrammarPoint,
                    lesson.GrammarExplanation,
                    lesson.Order,
                    lesson.IsPublished
                })
                .ToListAsync();

            return Ok(lessons);
        }

        // POST: /api/admin/lessons
        [HttpPost("lessons")]
        public async Task<IActionResult> CreateLesson(
            [FromBody] CreateLessonDTO dto
        )
        {
            var courseExists = await _context.Courses
                .AnyAsync(course => course.Id == dto.CourseId);

            if (!courseExists)
            {
                return NotFound(new
                {
                    message = "Course not found."
                });
            }

            var lesson = new Lesson
            {
                Id = Guid.NewGuid(),
                CourseId = dto.CourseId,
                Title = dto.Title.Trim(),
                GrammarPoint = dto.GrammarPoint.Trim(),
                GrammarExplanation = dto.GrammarExplanation.Trim(),
                Order = dto.Order,
                IsPublished = dto.IsPublished
            };

            _context.Lessons.Add(lesson);

            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                lesson.Id,
                lesson.CourseId,
                lesson.Title,
                lesson.GrammarPoint,
                lesson.GrammarExplanation,
                lesson.Order,
                lesson.IsPublished
            });
        }

        // DELETE: /api/admin/lessons/{lessonId}
        [HttpDelete("lessons/{lessonId:guid}")]
        public async Task<IActionResult> DeleteLesson(Guid lessonId)
        {
            var lesson = await _context.Lessons
                .FirstOrDefaultAsync(lesson => lesson.Id == lessonId);

            if (lesson is null)
            {
                return NotFound(new
                {
                    message = "Lesson not found."
                });
            }

            _context.Lessons.Remove(lesson);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}