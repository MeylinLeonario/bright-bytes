using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

using BrightBytes.Api.Data;
using backend.api.src.application.DTOs;
using backend.api.src.application.services;
using backend.api.src.models;
using System.Text.RegularExpressions;

namespace BrightEnglish.Api.Controllers;

[ApiController]
[Route("api/student")]
[Authorize]
public class StudentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ExerciseCorrectionService _correctionService;
    private readonly ILogger<StudentController> _logger;

    public StudentController(
            AppDbContext context,
            ExerciseCorrectionService correctionService,
            ILogger<StudentController> logger)
        {
            _context = context;
            _correctionService = correctionService;
            _logger = logger;
    }
    [HttpGet("courses")]
    public async Task<IActionResult> GetCourses()
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        await EnsureDefaultEnrollment(userId);
        var completedLessonIds = await _context.UserProgress
            .Where(progress => progress.UserId == userId && progress.Completed)
            .Select(progress => progress.LessonId)
            .ToListAsync();

        var courses = await _context.Courses
            .AsNoTracking()
            .Where(course => course.IsPublished)
            .OrderBy(course => course.Level)
            .Select(course => new
            {
                course.Id,
                course.Title,
                course.Description,
                course.Level,
                Enrolled = course.Enrollments.Any(enrollment => enrollment.UserId == userId),
                Lessons = course.Lessons
                    .Where(lesson => lesson.IsPublished)
                    .OrderBy(lesson => lesson.Order)
                    .Select(lesson => new
                    {
                        lesson.Id,
                        lesson.Title,
                        lesson.GrammarPoint,
                        lesson.Order,
                        Completed = completedLessonIds.Contains(lesson.Id)
                    }).ToList()
            })
            .ToListAsync();

        return Ok(courses);
    }

    [HttpPost("lessons/{lessonId:guid}/speaking-corrections")]
    [RequestSizeLimit(15_000_000)]
    public async Task<IActionResult> CorrectSpeakingExercise(
        Guid lessonId, IFormFile audio, [FromForm] double durationSeconds, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        if (audio is null || audio.Length == 0)
            return BadRequest(new { message = "Please record some audio before requesting a correction." });
        if (audio.Length > 15_000_000)
            return BadRequest(new { message = "The audio recording must be smaller than 15 MB." });
        if (durationSeconds is <= 0 or > 90.5)
            return BadRequest(new { message = "Your recording must be no longer than 1 minute and 30 seconds." });

        var lesson = await _context.Lessons.AsNoTracking().Where(item =>
                item.Id == lessonId && item.IsPublished && item.Course.IsPublished &&
                item.Course.Enrollments.Any(enrollment => enrollment.UserId == userId))
            .Select(item => new { item.Title, Prompt = item.SpeakingPrompt })
            .FirstOrDefaultAsync(cancellationToken);
        if (lesson is null) return NotFound(new { message = "Lesson not found or you are not enrolled in its course." });

        var attemptsUsed = await _context.ExerciseCorrections.CountAsync(correction =>
            correction.UserId == userId && correction.LessonId == lessonId &&
            correction.ExerciseType == "speaking", cancellationToken);
        if (attemptsUsed >= 2)
            return Conflict(new { message = "You have already used both corrections for this exercise." });

        await using var stream = audio.OpenReadStream();
        var transcription = await _correctionService.TranscribeAsync(
            stream, audio.FileName, audio.ContentType ?? "audio/webm", cancellationToken);
        var wordCount = Regex.Matches(transcription, @"\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b").Count;
        if (wordCount is < 1 or > 200)
            return BadRequest(new { message = "Your recording must contain between 1 and 200 words." });

        var result = await _correctionService.CorrectAsync("speaking", lesson.Prompt, transcription, cancellationToken);
        var correction = new ExerciseCorrection
        {
            Id = Guid.NewGuid(), UserId = userId, LessonId = lessonId, ExerciseType = "speaking",
            AttemptNumber = attemptsUsed + 1, OriginalText = transcription,
            CorrectedText = result.CorrectedText, Feedback = result.Feedback
        };
        _context.ExerciseCorrections.Add(correction);
        try { await _context.SaveChangesAsync(cancellationToken); }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Another correction was submitted at the same time. Please refresh the lesson." });
        }

        var user = await _context.Users.AsNoTracking().Where(item => item.Id == userId)
            .Select(item => new { item.Name, item.Email }).SingleAsync(cancellationToken);
        correction.SyncedToGoogleSheets = await _correctionService.AppendToGoogleSheetsAsync(new
        {
            correction.Id, correction.CreatedAt, user.Name, user.Email, Lesson = lesson.Title,
            correction.ExerciseType, correction.AttemptNumber, correction.OriginalText,
            correction.CorrectedText, correction.Feedback
        }, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            correction.CorrectedText, correction.Feedback, correction.AttemptNumber,
            AttemptsRemaining = 2 - correction.AttemptNumber, correction.SyncedToGoogleSheets
        });
    }
    

    [HttpPost("courses/{courseId:guid}/enroll")]
    public async Task<IActionResult> Enroll(Guid courseId)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();

        var course = await _context.Courses
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == courseId && item.IsPublished);
        if (course is null) return NotFound(new { message = "Course not found." });

        var enrollment = await _context.CourseEnrollments
            .FirstOrDefaultAsync(item => item.UserId == userId && item.CourseId == courseId);
        if (enrollment is null)
        {
            enrollment = new backend.api.src.models.CourseEnrollment
            {
                Id = Guid.NewGuid(), UserId = userId, CourseId = courseId
            };
            _context.CourseEnrollments.Add(enrollment);
            await _context.SaveChangesAsync();
        }

        return Ok(new { courseId, enrolled = true, enrollment.EnrolledAt });
    }

    [HttpGet("lessons/{lessonId:guid}")]
    public async Task<IActionResult> GetLesson(Guid lessonId)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        await EnsureDefaultEnrollment(userId);
        var lesson = await _context.Lessons
            .AsNoTracking()
            .Where(item => item.Id == lessonId && item.IsPublished && item.Course.IsPublished &&
                item.Course.Enrollments.Any(enrollment => enrollment.UserId == userId))
            .Select(item => new
            {
                item.Id,
                item.Title,
                item.GrammarPoint,
                item.GrammarExplanation,
                item.WritingPrompt,
                item.SpeakingPrompt,
                item.Order,
                CourseId = item.Course.Id,
                CourseTitle = item.Course.Title,
                Vocabulary = item.Vocabulary.Select(word => new
                {
                    word.Id, word.Word, word.Meaning, word.Example, word.AudioUrl
                }).ToList(),
                Readings = item.Readings.Select(reading => new
                {
                    reading.Id, reading.Title, reading.Text, reading.AudioUrl
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (lesson is null) return NotFound(new { message = "Lesson not found or you are not enrolled in its course." });

        var lessonIds = await _context.Lessons
            .Where(item => item.CourseId == lesson.CourseId && item.IsPublished)
            .OrderBy(item => item.Order)
            .Select(item => item.Id)
            .ToListAsync();
        var index = lessonIds.IndexOf(lessonId);
        var completed = await _context.UserProgress.AnyAsync(progress =>
            progress.UserId == userId && progress.LessonId == lessonId && progress.Completed);
        var correctionAttempts = await _context.ExerciseCorrections
            .Where(correction => correction.UserId == userId && correction.LessonId == lessonId)
            .GroupBy(correction => correction.ExerciseType)
            .Select(group => new { Type = group.Key, Count = group.Count() })
            .ToDictionaryAsync(item => item.Type, item => item.Count);

        return Ok(new
        {
            lesson.Id, lesson.Title, lesson.GrammarPoint, lesson.GrammarExplanation,
            lesson.WritingPrompt, lesson.SpeakingPrompt, lesson.Order,
            lesson.CourseId, lesson.CourseTitle, lesson.Vocabulary, lesson.Readings,
            Completed = completed,
            WritingAttemptsUsed = correctionAttempts.GetValueOrDefault("writing"),
            SpeakingAttemptsUsed = correctionAttempts.GetValueOrDefault("speaking"),
            PreviousLessonId = index > 0 ? lessonIds[index - 1] : (Guid?)null,
            NextLessonId = index >= 0 && index < lessonIds.Count - 1 ? lessonIds[index + 1] : (Guid?)null
        });
    }

    [HttpPost("lessons/{lessonId:guid}/corrections")]
    public async Task<IActionResult> CorrectExercise(Guid lessonId, CorrectExerciseDTO dto, CancellationToken cancellationToken)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        var exerciseType = dto.ExerciseType.Trim().ToLowerInvariant();
        if (exerciseType is not ("writing" or "speaking"))
            return BadRequest(new { message = "Exercise type must be writing or speaking." });

        var text = dto.Text.Trim();
        var wordCount = Regex.Matches(text, @"\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b").Count;
        if (wordCount is < 1 or > 200)
            return BadRequest(new { message = "Your answer must contain between 1 and 200 words." });

        var lesson = await _context.Lessons.AsNoTracking().Where(item =>
                item.Id == lessonId && item.IsPublished && item.Course.IsPublished &&
                item.Course.Enrollments.Any(enrollment => enrollment.UserId == userId))
            .Select(item => new
            {
                item.Title,
                Prompt = exerciseType == "writing" ? item.WritingPrompt : item.SpeakingPrompt
            }).FirstOrDefaultAsync(cancellationToken);
        if (lesson is null) return NotFound(new { message = "Lesson not found or you are not enrolled in its course." });

        var attemptsUsed = await _context.ExerciseCorrections.CountAsync(correction =>
            correction.UserId == userId && correction.LessonId == lessonId &&
            correction.ExerciseType == exerciseType, cancellationToken);
        if (attemptsUsed >= 2)
            return Conflict(new { message = "You have already used both corrections for this exercise." });

        var result = await _correctionService.CorrectAsync(exerciseType, lesson.Prompt, text, cancellationToken);
        var correction = new ExerciseCorrection
        {
            Id = Guid.NewGuid(), UserId = userId, LessonId = lessonId,
            ExerciseType = exerciseType, AttemptNumber = attemptsUsed + 1,
            OriginalText = text, CorrectedText = result.CorrectedText, Feedback = result.Feedback
        };
        _context.ExerciseCorrections.Add(correction);
        try
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            return Conflict(new { message = "Another correction was submitted at the same time. Please refresh the lesson." });
        }

        var user = await _context.Users.AsNoTracking().Where(item => item.Id == userId)
            .Select(item => new { item.Name, item.Email }).SingleAsync(cancellationToken);
        correction.SyncedToGoogleSheets = await _correctionService.AppendToGoogleSheetsAsync(new
        {
            correction.Id, correction.CreatedAt, user.Name, user.Email, Lesson = lesson.Title,
            correction.ExerciseType, correction.AttemptNumber, correction.OriginalText,
            correction.CorrectedText, correction.Feedback
        }, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            correction.CorrectedText, correction.Feedback, correction.AttemptNumber,
            AttemptsRemaining = 2 - correction.AttemptNumber,
            correction.SyncedToGoogleSheets
        });
    }

    [HttpPost("lessons/{lessonId:guid}/complete")]
    public async Task<IActionResult> CompleteLesson(Guid lessonId)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        await EnsureDefaultEnrollment(userId);
        var exists = await _context.Lessons.AnyAsync(lesson =>
            lesson.Id == lessonId && lesson.IsPublished && lesson.Course.IsPublished &&
            lesson.Course.Enrollments.Any(enrollment => enrollment.UserId == userId));
        if (!exists) return NotFound(new { message = "Lesson not found or you are not enrolled in its course." });

        var progress = await _context.UserProgress.FirstOrDefaultAsync(item =>
            item.UserId == userId && item.LessonId == lessonId);
        if (progress is null)
        {
            progress = new backend.api.src.models.UserProgress
            {
                Id = Guid.NewGuid(), UserId = userId, LessonId = lessonId
            };
            _context.UserProgress.Add(progress);
        }
        progress.Completed = true;
        progress.CompletedAt ??= DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { progress.Completed, progress.CompletedAt });
    }
    
   [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        if (!Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var userExists = await _context.Users
            .AsNoTracking()
            .AnyAsync(u => u.Id == userId);

        if (!userExists)
        {
            return NotFound(new
            {
                message = "Usuario no encontrado."
            });
        }

        await EnsureDefaultEnrollment(userId);

        // 1. Lecciones completadas
        var completedLessons = await _context.UserProgress
            .AsNoTracking()
            .Where(progress =>
                progress.UserId == userId &&
                progress.Completed
            )
            .ToListAsync();

        // 2. IDs únicos de lecciones completadas
        var completedLessonIds = completedLessons
            .Select(progress => progress.LessonId)
            .Distinct()
            .ToList();

        var lessonsCompleted = completedLessonIds.Count;

        // 3. Palabras aprendidas
        var wordsLearned = await _context.VocabularyItems
            .AsNoTracking()
            .CountAsync(vocabulary =>
                completedLessonIds.Contains(vocabulary.LessonId)
            );

        // 4. Streak
        var completedDates = completedLessons
            .Where(progress => progress.CompletedAt.HasValue)
            .Select(progress => progress.CompletedAt!.Value.Date)
            .Distinct()
            .OrderByDescending(date => date)
            .ToList();

        var streak = CalculateStreak(completedDates);

        // 5. Curso actual
        var currentCourse = await _context.Courses
            .AsNoTracking()
            .Where(course => course.IsPublished &&
                course.Enrollments.Any(enrollment => enrollment.UserId == userId))
            .OrderByDescending(course => course.Level == "A2")
            .ThenBy(course => course.Enrollments
                .Where(enrollment => enrollment.UserId == userId)
                .Min(enrollment => enrollment.EnrolledAt))

            .Include(course => course.Lessons)
            .FirstOrDefaultAsync();

        double courseProgress = 0;

        if (currentCourse != null)
        {
            var publishedLessons = currentCourse.Lessons
                .Where(lesson => lesson.IsPublished)
                .ToList();

            var totalLessons = publishedLessons.Count;

            if (totalLessons > 0)
            {
                var courseLessonIds = publishedLessons
                    .Select(lesson => lesson.Id)
                    .ToHashSet();

                var completedCourseLessons = completedLessonIds
                    .Count(lessonId =>
                        courseLessonIds.Contains(lessonId)
                    );

                courseProgress = Math.Round(
                    (double)completedCourseLessons /
                    totalLessons * 100,
                    1
                );
            }
        }

        var courseLessonsCompleted = 0;
        var totalCourseLessons = 0;
        var lessonsRemaining = 0;

        ContinueLessonDTO? continueLesson = null;

        if (currentCourse != null)
        {
            var publishedLessons = currentCourse.Lessons
                .Where(lesson => lesson.IsPublished)
                .OrderBy(lesson => lesson.Order)
                .ToList();

            totalCourseLessons = publishedLessons.Count;

            var courseLessonIds = publishedLessons
                .Select(lesson => lesson.Id)
                .ToHashSet();

            courseLessonsCompleted = completedLessonIds
                .Count(id => courseLessonIds.Contains(id));

            lessonsRemaining =
                totalCourseLessons - courseLessonsCompleted;

            if (totalCourseLessons > 0)
            {
                courseProgress = Math.Round(
                    (double)courseLessonsCompleted /
                    totalCourseLessons * 100,
                    1
                );
            }

            var nextLesson = publishedLessons
                .FirstOrDefault(lesson =>
                    !completedLessonIds.Contains(lesson.Id)
                );

            if (nextLesson != null)
            {
                continueLesson = new ContinueLessonDTO
                {
                    Id = nextLesson.Id,
                    Title = nextLesson.Title,
                    GrammarPoint = nextLesson.GrammarPoint,
                    Order = nextLesson.Order
                };
            }
        }

        var today = DateTime.UtcNow.Date;

        var monday = today.AddDays(
            -(((int)today.DayOfWeek + 6) % 7)
        );

        var weeklyGoal = new List<WeeklyStudyDayDTO>();

        for (var i = 0; i < 5; i++)
        {
            var date = monday.AddDays(i);

            var studied = completedDates.Contains(date);

            weeklyGoal.Add(new WeeklyStudyDayDTO
            {
                Day = date.ToString("ddd"),
                Completed = studied
            });
        }

        var recentProgress = completedLessons
        .Where(progress => progress.CompletedAt.HasValue)
        .OrderByDescending(progress => progress.CompletedAt)
        .Take(3)
        .ToList();

    var recentLessonIds = recentProgress
        .Select(progress => progress.LessonId)
        .ToList();

    var recentLessons = await _context.Lessons
        .AsNoTracking()
        .Where(lesson => recentLessonIds.Contains(lesson.Id))
        .ToDictionaryAsync(
            lesson => lesson.Id,
            lesson => lesson.Title
        );

    var recentActivity = recentProgress
        .Where(progress =>
            recentLessons.ContainsKey(progress.LessonId)
        )
        .Select(progress => new RecentActivityDTO
        {
            LessonId = progress.LessonId,

            LessonTitle =
                recentLessons[progress.LessonId],

            CompletedAt =
                progress.CompletedAt!.Value
        })
        .ToList();

        AchievementDTO? latestAchievement = null;

        if (streak >= 30)
        {
            latestAchievement = new AchievementDTO
            {
                Title = "30 day streak",
                Description =
                    "Estudiaste inglés 30 días seguidos."
            };
        }
        else if (streak >= 14)
        {
            latestAchievement = new AchievementDTO
            {
                Title = "14 day streak",
                Description =
                    "Estudiaste inglés 14 días seguidos."
            };
        }
        else if (streak >= 7)
        {
            latestAchievement = new AchievementDTO
            {
                Title = "7 day streak",
                Description =
                    "Estudiaste inglés 7 días seguidos."
            };
        }
        else if (streak >= 3)
        {
            latestAchievement = new AchievementDTO
            {
                Title = "3 day streak",
                Description =
                    "Estudiaste inglés 3 días seguidos."
            };
        }

        // 6. Respuesta del dashboard
        var dashboard = new StudentDashboardDTO
        {
            Streak = streak,
            LessonsCompleted = lessonsCompleted,
            WordsLearned = wordsLearned,

            CourseProgress = courseProgress,

            CourseTitle = currentCourse?.Title ?? "English A2",
            CourseLevel = currentCourse?.Level ?? "A2",

            CourseLessonsCompleted = courseLessonsCompleted,
            TotalCourseLessons = totalCourseLessons,
            LessonsRemaining = lessonsRemaining,

            ContinueLesson = continueLesson,

            WeeklyGoal = weeklyGoal,

            RecentActivity = recentActivity,

            LatestAchievement = latestAchievement
        };

        
        return Ok(dashboard);
    }

    private static int CalculateStreak(List<DateTime> completedDates)
    {
        if (completedDates.Count == 0)
        {
            return 0;
        }

        var today = DateTime.UtcNow.Date;
        var latestStudyDate = completedDates[0];

        // Si no estudió hoy ni ayer, la racha ya terminó.
        if (latestStudyDate != today &&
            latestStudyDate != today.AddDays(-1))
        {
            return 0;
        }

        var streak = 1;
        var expectedDate = latestStudyDate.AddDays(-1);

        for (var i = 1; i < completedDates.Count; i++)
        {
            if (completedDates[i] == expectedDate)
            {
                streak++;
                expectedDate = expectedDate.AddDays(-1);
            }
            else if (completedDates[i] < expectedDate)
            {
                break;
            }
        }

        return streak;
    }

      private bool TryGetUserId(out Guid userId)
    {
        return Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);
    }

    private async Task EnsureDefaultEnrollment(Guid userId)
    {
        if (await _context.CourseEnrollments.AnyAsync(enrollment => enrollment.UserId == userId)) return;

        var defaultCourseId = await _context.Courses
            .Where(course => course.IsPublished && course.Level == "A2")
            .OrderBy(course => course.Title)
            .Select(course => (Guid?)course.Id)
            .FirstOrDefaultAsync();
        if (!defaultCourseId.HasValue) return;

        _context.CourseEnrollments.Add(new backend.api.src.models.CourseEnrollment
        {
            Id = Guid.NewGuid(), UserId = userId, CourseId = defaultCourseId.Value
        });
        await _context.SaveChangesAsync();
    }
}