using FluentValidation;
using Mediator;
using XD.Application.Auth.Contracts;
using XD.Application.Auth.Dtos;

namespace XD.Application.Auth.LoginUser;

public sealed class LoginUserCommandHandler(
    IJwtTokenGenerator jwtTokenGenerator,
    IPasswordHasher passwordHasher,
    IUserRepository userRepository,
    IValidator<LoginUserCommand> validator)
    : IRequestHandler<LoginUserCommand, AuthenticationResponseDto?>
{
    public async ValueTask<AuthenticationResponseDto?> Handle(
        LoginUserCommand request,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        var normalizedEmail = EmailAddressNormalizer.Normalize(request.Email);
        var user = await userRepository.GetByNormalizedEmailAsync(normalizedEmail, cancellationToken);

        if (user is null || !passwordHasher.VerifyPassword(user, request.Password))
        {
            return null;
        }

        return jwtTokenGenerator.GenerateToken(user);
    }
}
