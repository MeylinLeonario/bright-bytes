using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.api.src.models
{
    public class Reading
{
    public Guid Id { get; set; }

    public Guid LessonId { get; set; }

    public Lesson Lesson { get; set; } = null!;

    public string Title { get; set; } = string.Empty;

    public string Text { get; set; } = string.Empty;

    public string? AudioUrl { get; set; }
}
}