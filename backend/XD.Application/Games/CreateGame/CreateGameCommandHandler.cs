using FluentValidation;
using Mediator;
using XD.Application.Games.Contracts;
using XD.Application.Games.Dtos;
using XD.Domain.Games;

namespace XD.Application.Games.CreateGame;

public sealed class CreateGameCommandHandler(
    IGameRepository gameRepository,
    TimeProvider timeProvider,
    IValidator<CreateGameCommand> validator)
    : IRequestHandler<CreateGameCommand, GameDto>
{
    public async ValueTask<GameDto> Handle(
        CreateGameCommand request,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(request, cancellationToken);

        var game = Game.Create(
            Guid.NewGuid(),
            request.Title,
            request.Description,
            request.PriceEur,
            request.Genre,
            timeProvider.GetUtcNow());

        game.AddInterest(request.UserId, timeProvider.GetUtcNow());

        await gameRepository.AddAsync(game, cancellationToken);

        var createdGame = await gameRepository.GetGamesAsync(request.UserId, cancellationToken);

        return createdGame.Single(gameDto => gameDto.Id == game.Id);
    }
}
