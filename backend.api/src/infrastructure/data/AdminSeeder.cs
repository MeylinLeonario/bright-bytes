using backend.api.src.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BrightBytes.Api.Data;

public static class AdminSeeder
{
    public static async Task SeedAsync(
        AppDbContext context,
        IConfiguration configuration)
    {
        var adminName = configuration["ADMIN_NAME"]
            ?? throw new InvalidOperationException("ADMIN_NAME is not configured.");

        var adminEmail = configuration["ADMIN_EMAIL"]
            ?? throw new InvalidOperationException("ADMIN_EMAIL is not configured.");

        var adminPassword = configuration["ADMIN_PASSWORD"]
            ?? throw new InvalidOperationException("ADMIN_PASSWORD is not configured.");

        var admin = await context.Users
            .SingleOrDefaultAsync(user => user.Email == adminEmail);

        if (admin is null)
        {
            admin = new User
            {
                Id = Guid.NewGuid(),
                Name = adminName,
                Email = adminEmail,
                Role = "admin",
                CreatedAt = DateTime.UtcNow
            };

            admin.PasswordHash = new PasswordHasher<User>()
                .HashPassword(admin, adminPassword);

            context.Users.Add(admin);
        }
        else
        {
            admin.Role = "admin";
        }

        await context.SaveChangesAsync();
    }
}