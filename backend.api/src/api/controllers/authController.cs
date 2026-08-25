using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using BrightEnglish.Api.DTOs;
using BrightBytes.Api.Data;
using backend.api.src.models;
using backend.api.src.application.DTOs;
using backend.api.src.application.services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace BrightEnglish.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly JwtService _jwtService;

    public AuthController(
        AppDbContext context,
        JwtService jwtService
    )
    {
        _context = context;
        _jwtService = jwtService;
        _passwordHasher = new PasswordHasher<User>();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO request)
    {
        string normalizedEmail = request.Email.Trim().ToLower();

        bool userExists = await _context.Users
            .AnyAsync(u => u.Email == normalizedEmail);

        if (userExists)
        {
            return Conflict(new
            {
                message = "Un usuario con este email ya existe."
            });
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Email = normalizedEmail,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash =
            _passwordHasher.HashPassword(user, request.Password);

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return StatusCode(201, new
        {
            message = "Usuario creado con éxito.",
            user = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.CreatedAt
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var normalizedEmail = dto.Email
            .Trim()
            .ToLowerInvariant();

        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.Email == normalizedEmail);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "Usuario o contraseña inválida."
            });
        }

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            dto.Password
        );

        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new
            {
                message = "Usuario o contraseña inválida."
            });
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new
        {
            message = "Login successful.",
            token,
            user = new
            {
                user.Id,
                user.Name,
                user.Email,
                user.Role
            }
        });

    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        if (!Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            id = user.Id,
            name = user.Name,
            email = user.Email,
            role = user.Role,
            level = user.Level,
            createdAt = user.CreatedAt,
            profilePhoto = user.ProfilePhoto is null ? null :
                $"data:{user.ProfilePhotoContentType};base64,{Convert.ToBase64String(user.ProfilePhoto)}"
        });
    }
    
    [Authorize]
    [HttpPut("me")]
    [RequestSizeLimit(2_100_000)]
    public async Task<IActionResult> UpdateMe([FromForm] string name, IFormFile? photo)
    {
        if (!TryGetUserId(out var userId)) return Unauthorized();
        var user = await _context.Users.SingleOrDefaultAsync(item => item.Id == userId);
        if (user is null) return NotFound(new { message = "Usuario no encontrado." });

        var cleanName = name.Trim();
        if (cleanName.Length is < 2 or > 80)
            return BadRequest(new { message = "El nombre debe tener entre 2 y 80 caracteres." });

        if (photo is not null)
        {
            string[] allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            if (photo.Length == 0 || photo.Length > 2_000_000 || !allowedTypes.Contains(photo.ContentType))
                return BadRequest(new { message = "La foto debe ser JPG, PNG o WebP y pesar menos de 2 MB." });
            await using var stream = new MemoryStream();
            await photo.CopyToAsync(stream);
            user.ProfilePhoto = stream.ToArray();
            user.ProfilePhotoContentType = photo.ContentType;
        }

        user.Name = cleanName;
        await _context.SaveChangesAsync();
        return Ok(new
        {
            user.Id, user.Name, user.Email, user.Role, user.Level, user.CreatedAt,
            ProfilePhoto = user.ProfilePhoto is null ? null :
                $"data:{user.ProfilePhotoContentType};base64,{Convert.ToBase64String(user.ProfilePhoto)}"
        });
    }

    private bool TryGetUserId(out Guid userId) => Guid.TryParse(
        User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub),
        out userId);
}