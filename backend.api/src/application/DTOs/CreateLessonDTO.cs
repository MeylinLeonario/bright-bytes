namespace backend.api.src.application.DTOs
{
    public class CreateLessonDTO
    {
        public Guid CourseId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string GrammarPoint { get; set; } = string.Empty;

        public string GrammarExplanation { get; set; } = string.Empty;

        public int Order { get; set; }

        public bool IsPublished { get; set; }
    }
}