using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.api.src.models
{
    public class VocabularyItem
{
    public Guid Id { get; set; }

    public Guid LessonId { get; set; }

    public Lesson Lesson { get; set; } = null!;

    public string Word { get; set; } = string.Empty;

    public string Meaning { get; set; } = string.Empty;

    public string Example { get; set; } = string.Empty;

    public string? AudioUrl { get; set; }
}
}