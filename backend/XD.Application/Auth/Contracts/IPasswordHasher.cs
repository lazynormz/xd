using XD.Domain.Auth;

namespace XD.Application.Auth.Contracts;

public interface IPasswordHasher
{
    string HashPassword(User user, string password);

    bool VerifyPassword(User user, string password);
}
