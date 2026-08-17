using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.api.src.models
{
    public class Lesson
{
    public Guid Id { get; set; }

    public Guid CourseId { get; set; }

    public Course Course { get; set; } = null!;

    public string Title { get; set; } = string.Empty;

    public string GrammarPoint { get; set; } = string.Empty;

    public string GrammarExplanation { get; set; } = string.Empty;

    public int Order { get; set; }

    public bool IsPublished { get; set; }

    public List<VocabularyItem> Vocabulary { get; set; } = [];

    public List<Reading> Readings { get; set; } = [];
}
}