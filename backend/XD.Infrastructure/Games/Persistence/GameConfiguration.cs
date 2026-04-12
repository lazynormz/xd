using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XD.Domain.Games;

namespace XD.Infrastructure.Games.Persistence;

public sealed class GameConfiguration : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder.ToTable("Games");

        builder.HasKey(game => game.Id);

        builder.Property(game => game.Title)
            .HasMaxLength(120)
            .IsRequired();

        builder.Property(game => game.Description)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(game => game.Genre)
            .HasMaxLength(80)
            .IsRequired();

        builder.Property(game => game.PriceEur)
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(game => game.CreatedAtUtc)
            .IsRequired();

        builder.HasMany(game => game.Interests)
            .WithOne(interest => interest.Game!)
            .HasForeignKey(interest => interest.GameId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
