using FluentValidation;

namespace XD.Application.Auth.RegisterUser;

public sealed class RegisterUserCommandValidator : AbstractValidator<RegisterUserCommand>
{
    public RegisterUserCommandValidator()
    {
        RuleFor(command => command.Username)
            .Cascade(CascadeMode.Stop)
            .NotEmpty()
            .MaximumLength(64)
            .Matches("^[a-zA-Z0-9_-]+$")
            .WithMessage("Display name can only use letters, numbers, hyphens, and underscores.");

        RuleFor(command => command.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(320);

        RuleFor(command => command.Password)
            .NotEmpty()
            .MinimumLength(8)
            .MaximumLength(200);
    }
}
