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
    [Authorize]
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
            if (string.IsNullOrWhiteSpace(dto.Level) ||
                string.IsNullOrWhiteSpace(dto.Title) ||            
                string.IsNullOrWhiteSpace(dto.Description))
            {
                return BadRequest(new
                {
                    message = "Level, title and description are required."
                });
            }

            var level = dto.Level.Trim().ToUpperInvariant();
            var courseAtLevelExists = await _context.Courses
                .AnyAsync(course => course.Level == level);

            if (courseAtLevelExists)
            {
                return Conflict(new
                {
                    message = $"A course at level {level} already exists."
                });
            }

            var course = new Course
            {
                Id = Guid.NewGuid(),
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                Level = level,
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

        // PATCH: /api/admin/courses/{courseId}
        [HttpPatch("courses/{courseId:guid}")]
        public async Task<IActionResult> UpdateCourse(
            Guid courseId,
            [FromBody] UpdateCourseDTO dto
        )
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return BadRequest(new { message = "Title is required." });
            }

            var course = await _context.Courses
                .FirstOrDefaultAsync(course => course.Id == courseId);

            if (course is null)
            {
                return NotFound(new { message = "Course not found." });
            }

            course.Title = dto.Title.Trim();
            await _context.SaveChangesAsync();

            return Ok(new
            {
                course.Id,
                course.Title,
                course.Description,
                course.Level,
                course.IsPublished,
                LessonCount = course.Lessons.Count
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
                    StudentCount = course.Enrollments.Count,
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

        // PATCH: /api/admin/courses/{courseId}/publication
        [HttpPatch("courses/{courseId:guid}/publication")]
        public async Task<IActionResult> UpdateCoursePublication(
            Guid courseId,
            [FromBody] UpdateCoursePublicationDTO dto
        )
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(course => course.Id == courseId);

            if (course is null)
            {
                return NotFound(new
                {
                    message = "Course not found."
                });
            }

            course.IsPublished = dto.IsPublished;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                course.Id,
                course.IsPublished
            });
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

         // GET: /api/admin/lessons/{lessonId}
        [HttpGet("lessons/{lessonId:guid}")]
        public async Task<IActionResult> GetLesson(Guid lessonId)
        {
            var lesson = await _context.Lessons
                .Where(lesson => lesson.Id == lessonId)
                .Select(lesson => new
                {
                    lesson.Id,
                    lesson.CourseId,
                    CourseTitle = lesson.Course.Title,
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
                .FirstOrDefaultAsync();

            return lesson is null
                ? NotFound(new { message = "Lesson not found." })
                : Ok(lesson);
        }

        // PUT: /api/admin/lessons/{lessonId}
        [HttpPut("lessons/{lessonId:guid}")]
        public async Task<IActionResult> UpdateLesson(
            Guid lessonId,
            [FromBody] CreateLessonDTO dto
        )
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            var lesson = await _context.Lessons
                .Include(lesson => lesson.Vocabulary)
                .Include(lesson => lesson.Readings)
                .FirstOrDefaultAsync(lesson => lesson.Id == lessonId);

            if (lesson is null)
            {
                return NotFound(new { message = "Lesson not found." });
            }

            lesson.Title = dto.Title.Trim();
            lesson.GrammarPoint = dto.GrammarPoint.Trim();
            lesson.GrammarExplanation = dto.GrammarExplanation.Trim();
            lesson.WritingPrompt = dto.WritingPrompt.Trim();
            lesson.SpeakingPrompt = dto.SpeakingPrompt.Trim();
            lesson.IsPublished = dto.IsPublished;

            _context.VocabularyItems.RemoveRange(lesson.Vocabulary.ToList());
            _context.Readings.RemoveRange(lesson.Readings.ToList());
            await _context.SaveChangesAsync();


            var vocabulary = dto.Vocabulary.Select(item => new VocabularyItem
                {
                Id = Guid.NewGuid(),
                LessonId = lesson.Id,
                Word = item.Word.Trim(),
                Meaning = item.Meaning.Trim(),
                Example = item.Example.Trim(),
                AudioUrl = item.AudioUrl
            }).ToList();
            
            var readings = dto.Readings.Select(item => new Reading
            {
                Id = Guid.NewGuid(),
                LessonId = lesson.Id,
                Title = item.Title.Trim(),
                Text = item.Text.Trim(),
                AudioUrl = item.AudioUrl
            }).ToList();

            _context.VocabularyItems.AddRange(vocabulary);
            _context.Readings.AddRange(readings);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
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
            });
        }


        // DELETE: /api/admin/lessons/{lessonId}
        [HttpDelete("lessons/{lessonId:guid}")]

            public async Task<IActionResult> DeleteLesson(Guid lessonId)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            var lesson = await _context.Lessons
                .FirstOrDefaultAsync(lesson => lesson.Id == lessonId);

            if (lesson is null)
            {
                return NotFound(new
                {
                    message = "Lesson not found."
                });
            }

            // UserProgress does not have an EF relationship to Lesson, so remove it
            // explicitly. Corrections are also removed here to keep this operation
            // independent of database cascade settings.
            await _context.UserProgress
                .Where(progress => progress.LessonId == lessonId)
                .ExecuteDeleteAsync();
            await _context.ExerciseCorrections
                .Where(correction => correction.LessonId == lessonId)
                .ExecuteDeleteAsync();
            
            _context.Lessons.Remove(lesson);

            await _context.SaveChangesAsync();

            // Keep the remaining lesson sequence contiguous after the deletion.
            await _context.Lessons
                .Where(item => item.CourseId == lesson.CourseId && item.Order > lesson.Order)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(item => item.Order, item => item.Order - 1));

            await transaction.CommitAsync();

            return NoContent();
        }
    }
}