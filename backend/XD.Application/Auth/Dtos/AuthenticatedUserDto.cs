using XD.Domain.Auth;

namespace XD.Application.Auth.Dtos;

public sealed record AuthenticatedUserDto(Guid Id, string Email, string DisplayName)
{
    public static AuthenticatedUserDto FromUser(User user)
    {
        ArgumentNullException.ThrowIfNull(user);

        return new AuthenticatedUserDto(user.Id, user.Email, user.DisplayName);
    }
}
