using Mediator;
using XD.Application.Auth.Dtos;

namespace XD.Application.Auth.GetCurrentUser;

public sealed record GetCurrentUserQuery(Guid UserId) : IRequest<AuthenticatedUserDto?>;
