using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.api.src.models
{
    public class Course
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Level { get; set; } = string.Empty;

    public bool IsPublished { get; set; }

    public List<Lesson> Lessons { get; set; } = [];
    public List<CourseEnrollment> Enrollments { get; set; } = [];
}
}