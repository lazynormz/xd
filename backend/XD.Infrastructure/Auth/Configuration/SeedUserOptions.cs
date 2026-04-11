using Microsoft.Extensions.Configuration;

namespace XD.Infrastructure.Auth.Configuration;

public sealed record SeedUserOptions(string? Email, string? Password)
{
    public const string SectionName = "SeedUser";

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(Email)
        && !string.IsNullOrWhiteSpace(Password);

    public static SeedUserOptions Create(IConfiguration configuration)
    {
        var section = configuration.GetSection(SectionName);

        return new SeedUserOptions(section["Email"], section["Password"]);
    }
}
