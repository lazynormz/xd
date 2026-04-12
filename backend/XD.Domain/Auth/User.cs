namespace XD.Domain.Auth;

public sealed class User
{
    private User()
    {
    }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public string DisplayName { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public Guid Id { get; private set; }

    public string NormalizedEmail { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public static User Create(
        Guid id,
        string displayName,
        string email,
        string normalizedEmail,
        DateTimeOffset createdAtUtc)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(displayName);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(normalizedEmail);

        return new User
        {
            CreatedAtUtc = createdAtUtc,
            DisplayName = displayName.Trim(),
            Email = email,
            Id = id,
            NormalizedEmail = normalizedEmail
        };
    }

    public void SetPasswordHash(string passwordHash)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(passwordHash);

        PasswordHash = passwordHash;
    }

    public void UpdateDisplayName(string displayName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(displayName);

        DisplayName = displayName.Trim();
    }
}
