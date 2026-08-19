namespace backend.api.src.models;

public class ExerciseCorrection
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid LessonId { get; set; }
    public Lesson Lesson { get; set; } = null!;
    public string ExerciseType { get; set; } = string.Empty;
    public int AttemptNumber { get; set; }
    public string OriginalText { get; set; } = string.Empty;
    public string CorrectedText { get; set; } = string.Empty;
    public string Feedback { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool SyncedToGoogleSheets { get; set; }
}
