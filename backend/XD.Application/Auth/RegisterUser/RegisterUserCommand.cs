using Mediator;

namespace XD.Application.Auth.RegisterUser;

public sealed record RegisterUserCommand(string Email, string Password, string Username)
    : IRequest<RegisterUserResult>;
