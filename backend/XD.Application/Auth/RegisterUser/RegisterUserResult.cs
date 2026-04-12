using XD.Application.Auth.Dtos;

namespace XD.Application.Auth.RegisterUser;

public sealed record RegisterUserResult(
    bool DisplayNameAlreadyExists,
    bool EmailAlreadyExists,
    AuthenticationResponseDto? Authentication)
{
    public static RegisterUserResult CreateDisplayNameAlreadyExists()
    {
        return new RegisterUserResult(true, false, null);
    }

    public static RegisterUserResult CreateEmailAlreadyExists()
    {
        return new RegisterUserResult(false, true, null);
    }

    public static RegisterUserResult CreateSuccess(AuthenticationResponseDto authentication)
    {
        return new RegisterUserResult(false, false, authentication);
    }
}
