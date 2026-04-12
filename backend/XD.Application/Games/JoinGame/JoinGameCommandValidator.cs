using FluentValidation;

namespace XD.Application.Games.JoinGame;

public sealed class JoinGameCommandValidator : AbstractValidator<JoinGameCommand>
{
    public JoinGameCommandValidator()
    {
        RuleFor(command => command.GameId)
            .NotEmpty();

        RuleFor(command => command.UserId)
            .NotEmpty();
    }
}
