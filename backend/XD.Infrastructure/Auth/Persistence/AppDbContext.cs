using Microsoft.EntityFrameworkCore;
using XD.Domain.Auth;
using XD.Domain.Games;

namespace XD.Infrastructure.Auth.Persistence;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Game> Games => Set<Game>();

    public DbSet<GameInterest> GameInterests => Set<GameInterest>();

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
