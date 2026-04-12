using Mediator;
using XD.Application.Games.Dtos;

namespace XD.Application.Games.CreateGame;

public sealed record CreateGameCommand(
    Guid UserId,
    string Title,
    string Description,
    decimal PriceEur,
    string Genre)
    : IRequest<GameDto>;
