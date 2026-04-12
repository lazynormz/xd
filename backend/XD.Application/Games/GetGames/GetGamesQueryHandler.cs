using Mediator;
using XD.Application.Games.Contracts;
using XD.Application.Games.Dtos;

namespace XD.Application.Games.GetGames;

public sealed class GetGamesQueryHandler(IGameRepository gameRepository)
    : IRequestHandler<GetGamesQuery, IReadOnlyList<GameDto>>
{
    public async ValueTask<IReadOnlyList<GameDto>> Handle(
        GetGamesQuery request,
        CancellationToken cancellationToken)
    {
        return await gameRepository.GetGamesAsync(request.CurrentUserId, cancellationToken);
    }
}
