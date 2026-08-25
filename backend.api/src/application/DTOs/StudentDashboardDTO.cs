namespace backend.api.src.application.DTOs;

public class StudentDashboardDTO
{
    public int Xp { get; set; }

    public int Bytes { get; set; }

    public int TodayLessonsCompleted { get; set; }

    public int ThisWeekLessonsCompleted { get; set; }

    public int BestWeekLessons { get; set; }
    public int Streak { get; set; }

    public int LessonsCompleted { get; set; }

    public int WordsLearned { get; set; }

    public double CourseProgress { get; set; }

    public string CourseTitle { get; set; } = string.Empty;

    public string CourseLevel { get; set; } = string.Empty;

    public int CourseLessonsCompleted { get; set; }

    public int TotalCourseLessons { get; set; }

    public int LessonsRemaining { get; set; }

    public ContinueLessonDTO? ContinueLesson { get; set; }

    public List<CourseLessonDTO> CourseLessons { get; set; } = [];
    public List<WeeklyStudyDayDTO> WeeklyGoal { get; set; } = [];

    public List<RecentActivityDTO> RecentActivity { get; set; } = [];

    public AchievementDTO? LatestAchievement { get; set; }
    public int WeeklyGoalDays { get; set; } = 5;

    public List<StudyActivityDayDTO> StudyActivity { get; set; } = [];
}

public class CourseLessonDTO
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string GrammarPoint { get; set; } = string.Empty;

    public int Order { get; set; }

    public bool Completed { get; set; }
}

public class StudyActivityDayDTO
{
    public DateTime Date { get; set; }
    public int Intensity { get; set; }
}

public class UpdateWeeklyGoalDTO
{
    public int Days { get; set; }
}

public class ContinueLessonDTO
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string GrammarPoint { get; set; } = string.Empty;

    public int Order { get; set; }
}

public class WeeklyStudyDayDTO
{
    public string Day { get; set; } = string.Empty;

    public bool Completed { get; set; }
}

public class RecentActivityDTO
{
    public Guid LessonId { get; set; }

    public string LessonTitle { get; set; } = string.Empty;

    public DateTime CompletedAt { get; set; }
}

public class AchievementDTO
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}