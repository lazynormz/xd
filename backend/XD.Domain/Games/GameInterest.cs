using XD.Domain.Auth;

namespace XD.Domain.Games;

public sealed class GameInterest
{
    private GameInterest()
    {
    }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public Game? Game { get; private set; }

    public Guid GameId { get; private set; }

    public User? User { get; private set; }

    public Guid UserId { get; private set; }

    public static GameInterest Create(Guid gameId, Guid userId, DateTimeOffset createdAtUtc)
    {
        return new GameInterest
        {
            CreatedAtUtc = createdAtUtc,
            GameId = gameId,
            UserId = userId
        };
    }
}
