namespace backend.api.src.models;

public class StudyActivity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid LessonId { get; set; }
    public DateTime ActivityDate { get; set; }
    public bool VisitedLesson { get; set; }
    public bool PracticedWriting { get; set; }
    public bool PracticedSpeaking { get; set; }
}