using XD.Application.Auth.Contracts;

namespace XD.Application.Auth;

public static class DisplayNameGenerator
{
    private const string DefaultDisplayName = "username";

    public static async Task<string> GenerateUniqueAsync(
        IUserRepository userRepository,
        CancellationToken cancellationToken)
    {
        var displayName = DefaultDisplayName;
        var suffix = 2;

        while (await userRepository.ExistsByDisplayNameAsync(displayName, null, cancellationToken))
        {
            displayName = $"{DefaultDisplayName}-{suffix}";
            suffix++;
        }

        return displayName;
    }
}
