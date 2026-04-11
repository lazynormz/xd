using XD.Domain.Auth;

namespace XD.Application.Auth.Contracts;

public interface IUserRepository
{
    Task AddAsync(User user, CancellationToken cancellationToken);

    Task<bool> ExistsByNormalizedEmailAsync(string normalizedEmail, CancellationToken cancellationToken);

    Task<User?> GetByIdAsync(Guid userId, CancellationToken cancellationToken);

    Task<User?> GetByNormalizedEmailAsync(string normalizedEmail, CancellationToken cancellationToken);
}
