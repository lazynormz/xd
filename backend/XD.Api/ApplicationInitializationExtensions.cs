using XD.Infrastructure.Auth.Persistence;

namespace XD.Api;

public static class ApplicationInitializationExtensions
{
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var databaseInitializer = scope.ServiceProvider.GetRequiredService<IDatabaseInitializer>();

        await databaseInitializer.InitializeAsync(CancellationToken.None);
    }
}
