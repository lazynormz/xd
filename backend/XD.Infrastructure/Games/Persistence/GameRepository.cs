using Microsoft.EntityFrameworkCore;
using XD.Application.Games.Contracts;
using XD.Application.Games.Dtos;
using XD.Domain.Games;
using XD.Infrastructure.Auth.Persistence;

namespace XD.Infrastructure.Games.Persistence;

public sealed class GameRepository(AppDbContext dbContext) : IGameRepository
{
    public async Task AddAsync(Game game, CancellationToken cancellationToken)
    {
        dbContext.Games.Add(game);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<Game?> GetByIdWithInterestsAsync(Guid gameId, CancellationToken cancellationToken)
    {
        return await dbContext.Games
            .Include(game => game.Interests)
            .FirstOrDefaultAsync(game => game.Id == gameId, cancellationToken);
    }

    public async Task<IReadOnlyList<GameDto>> GetGamesAsync(
        Guid currentUserId,
        CancellationToken cancellationToken)
    {
        var games = await dbContext.Games
            .AsNoTracking()
            .Include(game => game.Interests)
            .ThenInclude(interest => interest.User)
            .ToListAsync(cancellationToken);

        return games
            .OrderByDescending(game => game.CreatedAtUtc)
            .Select(game => new GameDto(
                game.Id,
                game.Title,
                game.Description,
                game.PriceEur,
                game.Genre,
                game.Interests.Any(interest => interest.UserId == currentUserId),
                game.Interests
                    .OrderBy(interest => interest.CreatedAtUtc)
                    .Select(interest => new GameInterestedUserDto(
                        interest.UserId,
                        interest.User!.DisplayName,
                        interest.User!.Email))
                    .ToList()))
            .ToList();
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
