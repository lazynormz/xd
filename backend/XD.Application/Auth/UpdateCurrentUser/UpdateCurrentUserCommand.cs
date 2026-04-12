using Mediator;

namespace XD.Application.Auth.UpdateCurrentUser;

public sealed record UpdateCurrentUserCommand(Guid UserId, string DisplayName)
    : IRequest<UpdateCurrentUserResult>;
