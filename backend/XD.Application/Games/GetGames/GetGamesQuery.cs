using Mediator;
using XD.Application.Games.Dtos;

namespace XD.Application.Games.GetGames;

public sealed record GetGamesQuery(Guid CurrentUserId) : IRequest<IReadOnlyList<GameDto>>;
