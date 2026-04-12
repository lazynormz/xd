using FluentValidation;
using Mediator;
using XD.Application.Games.Contracts;
using XD.Application.Games.Dtos;

namespace XD.Application.Games.JoinGame;

public sealed class JoinGameCommandHandler(
    IGameRepository gameRepository,
    TimeProvider timeProvider,
    IValidator<JoinGameCommand> validator)
    : IRequestHandler<JoinGameCommand, GameDto?>
{
    public async ValueTask<GameDto?> Handle(
        JoinGameCommand request,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        var game = await gameRepository.GetByIdWithInterestsAsync(request.GameId, cancellationToken);

        if (game is null)
        {
            return null;
        }

        game.AddInterest(request.UserId, timeProvider.GetUtcNow());

        await gameRepository.SaveChangesAsync(cancellationToken);

        var games = await gameRepository.GetGamesAsync(request.UserId, cancellationToken);

        return games.Single(gameDto => gameDto.Id == request.GameId);
    }
}
