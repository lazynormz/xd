using Mediator;
using XD.Application.Auth.Dtos;

namespace XD.Application.Auth.RegisterUser;

public sealed record RegisterUserCommand(string Email, string Password)
    : IRequest<AuthenticationResponseDto?>;
