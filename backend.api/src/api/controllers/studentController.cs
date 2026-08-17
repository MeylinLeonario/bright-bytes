using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

using BrightBytes.Api.Data;
using backend.api.src.application.DTOs;

namespace BrightEnglish.Api.Controllers;

[ApiController]
[Route("api/student")]
[Authorize]
public class StudentController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentController(AppDbContext context)
    {
        _context = context;
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
            .Include(course => course.Lessons)
            .FirstOrDefaultAsync(course =>
                course.Level == "A2" &&
                course.IsPublished
            );

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
}