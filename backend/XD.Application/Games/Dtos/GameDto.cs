namespace XD.Application.Games.Dtos;

public sealed record GameDto(
    Guid Id,
    string Title,
    string Description,
    decimal PriceEur,
    string Genre,
    bool CurrentUserWantsToPlay,
    IReadOnlyList<GameInterestedUserDto> InterestedUsers);
