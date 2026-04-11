namespace XD.Application.Auth.Dtos;

public sealed record AuthenticationResponseDto(
    string AccessToken,
    string TokenType,
    DateTimeOffset ExpiresAtUtc,
    AuthenticatedUserDto User);
