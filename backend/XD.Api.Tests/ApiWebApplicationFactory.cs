using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using XD.Api;
using XD.Infrastructure.Auth.Persistence;

namespace XD.Api.Tests;

public sealed class ApiWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseDirectory = Path.Combine(
        AppContext.BaseDirectory,
        "test-data",
        Guid.NewGuid().ToString("N"));

    private string DatabasePath => Path.Combine(_databaseDirectory, "xd-tests.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Directory.CreateDirectory(_databaseDirectory);

        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, configurationBuilder) =>
        {
            configurationBuilder.AddInMemoryCollection(
            [
                new KeyValuePair<string, string?>(
                    "ConnectionStrings:DefaultConnection",
                    $"Data Source={DatabasePath}"),
                new KeyValuePair<string, string?>("Jwt:Audience", "XD.Client.Tests"),
                new KeyValuePair<string, string?>("Jwt:Issuer", "XD.Api.Tests"),
                new KeyValuePair<string, string?>(
                    "Jwt:SigningKey",
                    "integration-test-signing-key-32-characters-minimum"),
                new KeyValuePair<string, string?>("Jwt:AccessTokenExpirationMinutes", "60"),
                new KeyValuePair<string, string?>("SeedUser:Email", "friend@example.com"),
                new KeyValuePair<string, string?>("SeedUser:Password", "Password123!")
            ]);
        });
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        var host = base.CreateHost(builder);

        using var scope = host.Services.CreateScope();
        var databaseInitializer = scope.ServiceProvider.GetRequiredService<IDatabaseInitializer>();
        databaseInitializer.InitializeAsync(CancellationToken.None).GetAwaiter().GetResult();

        return host;
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (!disposing || !Directory.Exists(_databaseDirectory))
        {
            return;
        }

        Directory.Delete(_databaseDirectory, true);
    }
}
