using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using XD.Domain.Auth;
using XD.Domain.Games;

namespace XD.Infrastructure.Games.Persistence;

public sealed class GameInterestConfiguration : IEntityTypeConfiguration<GameInterest>
{
    public void Configure(EntityTypeBuilder<GameInterest> builder)
    {
        builder.ToTable("GameInterests");

        builder.HasKey(interest => new { interest.GameId, interest.UserId });

        builder.Property(interest => interest.CreatedAtUtc)
            .IsRequired();

        builder.HasOne(interest => interest.User)
            .WithMany()
            .HasForeignKey(interest => interest.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
