using XD.Application.Auth.Dtos;

namespace XD.Application.Auth.UpdateCurrentUser;

public sealed record UpdateCurrentUserResult(
    bool DisplayNameAlreadyExists,
    AuthenticatedUserDto? User,
    bool UserNotFound)
{
    public static UpdateCurrentUserResult CreateDisplayNameAlreadyExists()
    {
        return new UpdateCurrentUserResult(true, null, false);
    }

    public static UpdateCurrentUserResult CreateSuccess(AuthenticatedUserDto user)
    {
        return new UpdateCurrentUserResult(false, user, false);
    }

    public static UpdateCurrentUserResult CreateUserNotFound()
    {
        return new UpdateCurrentUserResult(false, null, true);
    }
}
