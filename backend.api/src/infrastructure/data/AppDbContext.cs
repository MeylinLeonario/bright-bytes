using backend.api.src.models;
using Microsoft.EntityFrameworkCore;

namespace BrightBytes.Api.Data;

public class AppDbContext : DbContext
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<CourseEnrollment>()
            .HasIndex(enrollment => new { enrollment.UserId, enrollment.CourseId })
            .IsUnique();

        modelBuilder.Entity<ExerciseCorrection>()
            .HasIndex(correction => new
            {
                correction.UserId,
                correction.LessonId,
                correction.ExerciseType,
                correction.AttemptNumber
            })
            .IsUnique();

        modelBuilder.Entity<StudyActivity>()
            .HasIndex(activity => new { activity.UserId, activity.LessonId, activity.ActivityDate })
            .IsUnique();

        modelBuilder.Entity<ShopPurchase>()
            .HasIndex(purchase => new { purchase.UserId, purchase.ItemId })
            .IsUnique();
    }
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<VocabularyItem> VocabularyItems => Set<VocabularyItem>();
    public DbSet<Reading> Readings => Set<Reading>();
    public DbSet<UserProgress> UserProgress => Set<UserProgress>();
    public DbSet<CourseEnrollment> CourseEnrollments => Set<CourseEnrollment>();
    public DbSet<ExerciseCorrection> ExerciseCorrections => Set<ExerciseCorrection>();
    public DbSet<StudyActivity> StudyActivities => Set<StudyActivity>();
    public DbSet<ShopPurchase> ShopPurchases => Set<ShopPurchase>();
}