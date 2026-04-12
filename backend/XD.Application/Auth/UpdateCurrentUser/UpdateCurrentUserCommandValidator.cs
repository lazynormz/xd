using FluentValidation;

namespace XD.Application.Auth.UpdateCurrentUser;

public sealed class UpdateCurrentUserCommandValidator : AbstractValidator<UpdateCurrentUserCommand>
{
    public UpdateCurrentUserCommandValidator()
    {
        RuleFor(command => command.DisplayName)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .MaximumLength(64)
            .Matches("^[a-zA-Z0-9_-]+$")
            .WithMessage("Display name can only use letters, numbers, hyphens, and underscores.");
    }
}
