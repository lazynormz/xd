using Mediator;
using XD.Application.Auth.Contracts;
using XD.Application.Auth.Dtos;

namespace XD.Application.Auth.GetCurrentUser;

public sealed class GetCurrentUserQueryHandler(IUserRepository userRepository)
    : IRequestHandler<GetCurrentUserQuery, AuthenticatedUserDto?>
{
    public async ValueTask<AuthenticatedUserDto?> Handle(
        GetCurrentUserQuery request,
        CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByIdAsync(request.UserId, cancellationToken);

        if (user is null)
        {
            return null;
        }

        return AuthenticatedUserDto.FromUser(user);
    }
}
