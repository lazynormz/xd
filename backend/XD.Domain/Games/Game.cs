namespace XD.Domain.Games;

public sealed class Game
{
    private Game()
    {
    }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public string Description { get; private set; } = string.Empty;

    public string Genre { get; private set; } = string.Empty;

    public Guid Id { get; private set; }

    public List<GameInterest> Interests { get; } = [];

    public decimal PriceEur { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public static Game Create(
        Guid id,
        string title,
        string description,
        decimal priceEur,
        string genre,
        DateTimeOffset createdAtUtc)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(description);
        ArgumentException.ThrowIfNullOrWhiteSpace(genre);

        return new Game
        {
            CreatedAtUtc = createdAtUtc,
            Description = description.Trim(),
            Genre = genre.Trim(),
            Id = id,
            PriceEur = priceEur,
            Title = title.Trim()
        };
    }

    public void AddInterest(Guid userId, DateTimeOffset createdAtUtc)
    {
        if (Interests.Any(interest => interest.UserId == userId))
        {
            return;
        }

        Interests.Add(GameInterest.Create(Id, userId, createdAtUtc));
    }
}
