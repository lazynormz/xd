using Microsoft.AspNetCore.Identity;
using XD.Application.Auth.Contracts;
using XD.Domain.Auth;

namespace XD.Infrastructure.Auth.Services;

public sealed class PasswordHasherService : IPasswordHasher
{
    private readonly PasswordHasher<User> _passwordHasher = new();

    public string HashPassword(User user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }

    public bool VerifyPassword(User user, string password)
    {
        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

        return verificationResult is PasswordVerificationResult.Success
            or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
