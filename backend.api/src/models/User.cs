using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.api.src.models
{
    public class User
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = "student";

    public string? Level { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? LastActiveAt { get; set; }

    public List<CourseEnrollment> CourseEnrollments { get; set; } = [];
}
}