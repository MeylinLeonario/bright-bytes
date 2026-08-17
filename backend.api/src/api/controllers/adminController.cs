using backend.api.src.application.DTOs;
using backend.api.src.models;
using BrightBytes.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.api.src.api.controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "admin")]
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

        // POST: /api/admin/courses
        [HttpPost("courses")]
        public async Task<IActionResult> CreateCourse(
            [FromBody] CreateCourseDTO dto
        )
        {
            if (string.IsNullOrWhiteSpace(dto.Title) ||
                string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest(new
                {
                    message = "Title and description are required."
                });
            }

            var a2CourseExists = await _context.Courses
                .AnyAsync(course => course.Level == "A2");

            if (a2CourseExists)
            {
                return Conflict(new
                {
                    message = "The A2 course already exists."
                });
            }

            var course = new Course
            {
                Id = Guid.NewGuid(),
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                Level = "A2",
                IsPublished = dto.IsPublished
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return StatusCode(201, new
            {
                course.Id,
                course.Title,
                course.Description,
                course.Level,
                course.IsPublished,
                LessonCount = 0
            });
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
                            lesson.WritingPrompt,
                            lesson.SpeakingPrompt,
                            lesson.Order,
                            lesson.IsPublished,
                            Vocabulary = lesson.Vocabulary.Select(item => new
                            {
                                item.Id,
                                item.Word,
                                item.Meaning,
                                item.Example,
                                item.AudioUrl
                            }).ToList(),
                            Readings = lesson.Readings.Select(item => new
                            {
                                item.Id,
                                item.Title,
                                item.Text,
                                item.AudioUrl
                            }).ToList()
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
                    lesson.WritingPrompt,
                    lesson.SpeakingPrompt,
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

            var nextOrder = await _context.Lessons
                .Where(lesson => lesson.CourseId == dto.CourseId)
                .Select(lesson => (int?)lesson.Order)
                .MaxAsync() ?? 0;

            var lesson = new Lesson
            {
                Id = Guid.NewGuid(),
                CourseId = dto.CourseId,
                Title = dto.Title.Trim(),
                GrammarPoint = dto.GrammarPoint.Trim(),
                GrammarExplanation = dto.GrammarExplanation.Trim(),
                WritingPrompt = dto.WritingPrompt.Trim(),
                SpeakingPrompt = dto.SpeakingPrompt.Trim(),
                Order = nextOrder + 1,
                IsPublished = dto.IsPublished,
                Vocabulary = dto.Vocabulary.Select(item => new VocabularyItem
                {
                    Id = Guid.NewGuid(),
                    Word = item.Word.Trim(),
                    Meaning = item.Meaning.Trim(),
                    Example = item.Example.Trim(),
                    AudioUrl = item.AudioUrl
                }).ToList(),
                Readings = dto.Readings.Select(item => new Reading
                {
                    Id = Guid.NewGuid(),
                    Title = item.Title.Trim(),
                    Text = item.Text.Trim(),
                    AudioUrl = item.AudioUrl
                }).ToList()
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
                lesson.WritingPrompt,
                lesson.SpeakingPrompt,
                lesson.Order,
                lesson.IsPublished,
                Vocabulary = lesson.Vocabulary.Select(item => new
                {
                    item.Id,
                    item.Word,
                    item.Meaning,
                    item.Example,
                    item.AudioUrl
                }),
                Readings = lesson.Readings.Select(item => new
                {
                    item.Id,
                    item.Title,
                    item.Text,
                    item.AudioUrl
                })
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