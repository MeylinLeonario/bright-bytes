using System.ComponentModel.DataAnnotations;

namespace backend.api.src.application.DTOs
{
    public class CreateLessonDTO
    {
        public Guid CourseId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string GrammarPoint { get; set; } = string.Empty;

        public string GrammarExplanation { get; set; } = string.Empty;

        public string WritingPrompt { get; set; } = string.Empty;

        public string SpeakingPrompt { get; set; } = string.Empty;

        public int Order { get; set; }

        public bool IsPublished { get; set; }

        [MinLength(5), MaxLength(5)]
        public List<CreateVocabularyItemDTO> Vocabulary { get; set; } = [];

        [MinLength(3), MaxLength(3)]
        public List<CreateReadingDTO> Readings { get; set; } = [];
    }

    public class CreateVocabularyItemDTO
    {
        [Required]
        public string Word { get; set; } = string.Empty;
        [Required]
        public string Meaning { get; set; } = string.Empty;
        [Required]
        public string Example { get; set; } = string.Empty;
        public string? AudioUrl { get; set; }
    }

    public class CreateReadingDTO
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Text { get; set; } = string.Empty;
        public string? AudioUrl { get; set; }
    }
}