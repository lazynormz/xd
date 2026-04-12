namespace XD.Api.Modules.Games.CreateGame;

public sealed record CreateGameRequest(
    string Title,
    string Description,
    decimal PriceEur,
    string Genre);
