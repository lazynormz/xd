using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using XD.Application.Auth.Contracts;
using XD.Application.Games.Contracts;
using XD.Infrastructure.Auth.Configuration;
using XD.Infrastructure.Auth.Persistence;
using XD.Infrastructure.Auth.Services;
using XD.Infrastructure.Games.Persistence;

namespace XD.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required.");

        var jwtOptions = JwtOptions.Create(configuration);
        var seedUserOptions = SeedUserOptions.Create(configuration);

        services.AddSingleton(jwtOptions);
        services.AddSingleton(seedUserOptions);
        services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));
        services.AddScoped<IDatabaseInitializer, DatabaseInitializer>();
        services.AddScoped<IGameRepository, GameRepository>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IPasswordHasher, PasswordHasherService>();
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}
