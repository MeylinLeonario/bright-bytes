using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.api.src.models
{
    public class UserProgress
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public Guid LessonId { get; set; }

    public bool Completed { get; set; }

    public DateTime? CompletedAt { get; set; }
}
}