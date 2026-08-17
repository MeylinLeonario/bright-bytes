using System.ComponentModel.DataAnnotations;

namespace backend.api.src.application.DTOs;

public class CreateCourseDTO
{
    [Required]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public bool IsPublished { get; set; }

}