using System.ComponentModel.DataAnnotations;

namespace backend.api.src.application.DTOs;

public class UpdateCourseDTO
{
    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;
}