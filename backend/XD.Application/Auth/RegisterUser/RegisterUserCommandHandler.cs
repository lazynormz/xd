using FluentValidation;
using Mediator;
using XD.Application.Auth.Contracts;
using XD.Application.Auth.Dtos;
using XD.Domain.Auth;

namespace XD.Application.Auth.RegisterUser;

public sealed class RegisterUserCommandHandler(
    IJwtTokenGenerator jwtTokenGenerator,
    IPasswordHasher passwordHasher,
    IUserRepository userRepository,
    TimeProvider timeProvider,
    IValidator<RegisterUserCommand> validator)
    : IRequestHandler<RegisterUserCommand, AuthenticationResponseDto?>
{
    public async ValueTask<AuthenticationResponseDto?> Handle(
        RegisterUserCommand request,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        var normalizedEmail = EmailAddressNormalizer.Normalize(request.Email);
        var emailAlreadyExists = await userRepository.ExistsByNormalizedEmailAsync(
            normalizedEmail,
            cancellationToken);

        if (emailAlreadyExists)
        {
            return null;
        }

        var displayName = await DisplayNameGenerator.GenerateUniqueAsync(
            userRepository,
            cancellationToken);

        var user = User.Create(
            Guid.NewGuid(),
            displayName,
            EmailAddressNormalizer.Sanitize(request.Email),
            normalizedEmail,
            timeProvider.GetUtcNow());

        user.SetPasswordHash(passwordHasher.HashPassword(user, request.Password));

        await userRepository.AddAsync(user, cancellationToken);

        return jwtTokenGenerator.GenerateToken(user);
    }
}
