using FluentValidation;

namespace XD.Application.Games.CreateGame;

public sealed class CreateGameCommandValidator : AbstractValidator<CreateGameCommand>
{
    public CreateGameCommandValidator()
    {
        RuleFor(command => command.UserId)
            .NotEmpty();

        RuleFor(command => command.Title)
            .NotEmpty()
            .MaximumLength(120);

        RuleFor(command => command.Description)
            .NotEmpty()
            .MaximumLength(2000);

        RuleFor(command => command.Genre)
            .NotEmpty()
            .MaximumLength(80);

        RuleFor(command => command.PriceEur)
            .GreaterThanOrEqualTo(0m)
            .LessThanOrEqualTo(999.99m);
    }
}
