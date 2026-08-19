using System.ComponentModel.DataAnnotations;

namespace backend.api.src.application.DTOs;

public class CorrectExerciseDTO
{
    [Required]
    public string ExerciseType { get; set; } = string.Empty;

    [Required]
    public string Text { get; set; } = string.Empty;
}
