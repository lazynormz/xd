using FluentValidation;
using Mediator;
using XD.Application.Auth.Contracts;
using XD.Application.Auth.Dtos;

namespace XD.Application.Auth.UpdateCurrentUser;

public sealed class UpdateCurrentUserCommandHandler(
    IUserRepository userRepository,
    IValidator<UpdateCurrentUserCommand> validator)
    : IRequestHandler<UpdateCurrentUserCommand, UpdateCurrentUserResult>
{
    public async ValueTask<UpdateCurrentUserResult> Handle(
        UpdateCurrentUserCommand request,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        var user = await userRepository.GetByIdAsync(request.UserId, cancellationToken);

        if (user is null)
        {
            return UpdateCurrentUserResult.CreateUserNotFound();
        }

        var displayName = request.DisplayName.Trim();
        var displayNameAlreadyExists = await userRepository.ExistsByDisplayNameAsync(
            displayName,
            request.UserId,
            cancellationToken);

        if (displayNameAlreadyExists)
        {
            return UpdateCurrentUserResult.CreateDisplayNameAlreadyExists();
        }

        user.UpdateDisplayName(displayName);
        await userRepository.UpdateAsync(user, cancellationToken);

        return UpdateCurrentUserResult.CreateSuccess(AuthenticatedUserDto.FromUser(user));
    }
}
