using Mediator;
using XD.Application.Games.Dtos;

namespace XD.Application.Games.JoinGame;

public sealed record JoinGameCommand(Guid GameId, Guid UserId) : IRequest<GameDto?>;
