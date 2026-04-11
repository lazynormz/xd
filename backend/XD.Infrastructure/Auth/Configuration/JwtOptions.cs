using Microsoft.Extensions.Configuration;

namespace XD.Infrastructure.Auth.Configuration;

public sealed record JwtOptions(string Issuer, string Audience, int AccessTokenExpirationMinutes, string SigningKey)
{
    public const string SectionName = "Jwt";

    public static JwtOptions Create(IConfiguration configuration)
    {
        var jwtSection = configuration.GetSection(SectionName);
        var issuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is required.");
        var audience = jwtSection["Audience"] ?? throw new InvalidOperationException("Jwt:Audience is required.");
        var configuredSigningKey = jwtSection["SigningKey"] ?? configuration["Jwt__SigningKey"]
            ?? throw new InvalidOperationException("Jwt:SigningKey is required.");

        if (configuredSigningKey.Length < 32)
        {
            throw new InvalidOperationException("Jwt:SigningKey must be at least 32 characters long.");
        }

        if (!int.TryParse(jwtSection["AccessTokenExpirationMinutes"], out var accessTokenExpirationMinutes))
        {
            accessTokenExpirationMinutes = 60;
        }

        if (accessTokenExpirationMinutes is < 5 or > 1440)
        {
            throw new InvalidOperationException("Jwt:AccessTokenExpirationMinutes must be between 5 and 1440.");
        }

        return new JwtOptions(issuer, audience, accessTokenExpirationMinutes, configuredSigningKey);
    }
}
