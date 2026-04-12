using FluentValidation;
using Mediator;
using XD.Application.Auth.Contracts;
using XD.Domain.Auth;

namespace XD.Application.Auth.RegisterUser;

public sealed class RegisterUserCommandHandler(
    IJwtTokenGenerator jwtTokenGenerator,
    IPasswordHasher passwordHasher,
    IUserRepository userRepository,
    TimeProvider timeProvider,
    IValidator<RegisterUserCommand> validator)
    : IRequestHandler<RegisterUserCommand, RegisterUserResult>
{
    public async ValueTask<RegisterUserResult> Handle(
        RegisterUserCommand request,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        var displayName = request.Username.Trim();
        var normalizedEmail = EmailAddressNormalizer.Normalize(request.Email);
        var emailAlreadyExists = await userRepository.ExistsByNormalizedEmailAsync(
            normalizedEmail,
            cancellationToken);

        if (emailAlreadyExists)
        {
            return RegisterUserResult.CreateEmailAlreadyExists();
        }

        var displayNameAlreadyExists = await userRepository.ExistsByDisplayNameAsync(
            displayName,
            null,
            cancellationToken);

        if (displayNameAlreadyExists)
        {
            return RegisterUserResult.CreateDisplayNameAlreadyExists();
        }

        var user = User.Create(
            Guid.NewGuid(),
            displayName,
            EmailAddressNormalizer.Sanitize(request.Email),
            normalizedEmail,
            timeProvider.GetUtcNow());

        user.SetPasswordHash(passwordHasher.HashPassword(user, request.Password));

        await userRepository.AddAsync(user, cancellationToken);

        return RegisterUserResult.CreateSuccess(jwtTokenGenerator.GenerateToken(user));
    }
}
