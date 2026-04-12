using XD.Application.Games.Dtos;
using XD.Domain.Games;

namespace XD.Application.Games.Contracts;

public interface IGameRepository
{
    Task AddAsync(Game game, CancellationToken cancellationToken);

    Task<Game?> GetByIdWithInterestsAsync(Guid gameId, CancellationToken cancellationToken);

    Task<IReadOnlyList<GameDto>> GetGamesAsync(Guid currentUserId, CancellationToken cancellationToken);

    Task SaveChangesAsync(CancellationToken cancellationToken);
}
