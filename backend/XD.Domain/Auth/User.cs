namespace XD.Domain.Auth;

public sealed class User
{
    private User()
    {
    }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    public string Email { get; private set; } = string.Empty;

    public Guid Id { get; private set; }

    public string NormalizedEmail { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public static User Create(
        Guid id,
        string email,
        string normalizedEmail,
        DateTimeOffset createdAtUtc)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(email);
        ArgumentException.ThrowIfNullOrWhiteSpace(normalizedEmail);

        return new User
        {
            CreatedAtUtc = createdAtUtc,
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
}
