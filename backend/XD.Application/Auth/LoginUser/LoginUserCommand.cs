using Mediator;
using XD.Application.Auth.Dtos;

namespace XD.Application.Auth.LoginUser;

public sealed record LoginUserCommand(string Email, string Password) : IRequest<AuthenticationResponseDto?>;
