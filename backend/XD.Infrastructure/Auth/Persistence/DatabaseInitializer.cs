using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using XD.Application.Auth;
using XD.Application.Auth.Contracts;
using XD.Domain.Auth;
using XD.Infrastructure.Auth.Configuration;

namespace XD.Infrastructure.Auth.Persistence;

public interface IDatabaseInitializer
{
    Task InitializeAsync(CancellationToken cancellationToken);
}

public sealed class DatabaseInitializer(
    AppDbContext dbContext,
    IPasswordHasher passwordHasher,
    SeedUserOptions seedUserOptions,
    TimeProvider timeProvider,
    IUserRepository userRepository,
    ILogger<DatabaseInitializer> logger)
    : IDatabaseInitializer
{
    public async Task InitializeAsync(CancellationToken cancellationToken)
    {
        await dbContext.Database.MigrateAsync(cancellationToken);

        if (!seedUserOptions.IsConfigured)
        {
            return;
        }

        var normalizedEmail = EmailAddressNormalizer.Normalize(seedUserOptions.Email!);
        var userExists = await dbContext.Users.AnyAsync(
            user => user.NormalizedEmail == normalizedEmail,
            cancellationToken);

        if (userExists)
        {
            return;
        }

        var displayName = await DisplayNameGenerator.GenerateUniqueAsync(
            userRepository,
            cancellationToken);

        var user = User.Create(
            Guid.NewGuid(),
            displayName,
            EmailAddressNormalizer.Sanitize(seedUserOptions.Email!),
            normalizedEmail,
            timeProvider.GetUtcNow());

        user.SetPasswordHash(passwordHasher.HashPassword(user, seedUserOptions.Password!));

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Seeded authentication user {Email}.", user.Email);
    }
}
